import { BrowserWindow } from 'electron';

const os = require('os');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const sudo = require('sudo-prompt');
const tmp = require('tmp');
const publicIp = require('public-ip');
const ps = require('ps-node');

const resourcesDir = process.resourcesPath + path.sep; // "." + path.sep + "resources" + path.sep + "app" + path.sep;
let appDir = os.homedir() + path.sep + 'RetronVPN' + path.sep;
let ovpnDir = appDir + 'ovpn';
let ovpnFileName = null;
let usersDir = appDir + 'users';
let miscDir = appDir + 'ms';
let openVPNExecCmd = 'openvpn';
let tmpCredentials = null;
let openvpn = null;
let openvpnPID = 0;
let fpOpenVPNStats = null;
let fpOpenVpnLog = null;
let connectingTimeout = null;
let connectTimeoutMillisec = 5000;
let connectedBeginTime = Date.now();
let connectedOnce = false;
let settings = {
  // killSwitch: false,
};
const cfgFilePath = path.normalize(miscDir + path.sep + "RetronVPN.cfg");

appDir = path.resolve(appDir) + path.sep;
ovpnDir = path.resolve(ovpnDir) + path.sep;
usersDir = path.resolve(usersDir) + path.sep;
miscDir = path.resolve(miscDir) + path.sep;

const mkDirByPathSync = (pathToCreate) => {
  pathToCreate.split(path.sep).reduce((prevPath, folder) => {
    const currentPath = path.join(prevPath, folder, path.sep);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
    return currentPath;
  }, '');
};

mkDirByPathSync(appDir);
mkDirByPathSync(ovpnDir);
mkDirByPathSync(usersDir);
mkDirByPathSync(miscDir);

const loadCfg = () => {
  let jsonData = null;
  try {
    jsonData = fs.readFileSync(cfgFilePath);
  } catch (err) {
    fs.writeFileSync(cfgFilePath, JSON.stringify(settings));
  }
  if (jsonData) {
    settings = JSON.parse(jsonData);
    // uiOptKillSwitch.checked = settings.killSwitch;
  }
};
loadCfg();

fs.closeSync(fs.openSync(miscDir + "OpenVPN.log", "w"));
fs.closeSync(fs.openSync(miscDir + "OpenVPN.status", "w"));
const logFile = fs.openSync(miscDir + 'RetronVPN.log', 'w');

const log = (message, alsoWiteToConsole = false) => {
  if (alsoWiteToConsole) {
    // console.log(message);
  }
  fs.writeSync(logFile, message + '\n\r');
};

let dnsTimeoutCount = 0;
let updateOpenVPNStatsTimeout = null;

const updateOpenVPNStats = () => {
  if (updateOpenVPNStatsTimeout) {
    // if (openvpnPID != 0) {
    //   if (doesProcessExist(openvpnPID) == false) {
    //     killSwitch();
    //   }
    // }
    const fileContents = fs.readFileSync(fpOpenVPNStats).toString();
    let read = 0;
    let written = 0;
    const tokens = fileContents.split('\n');
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      if (token.includes('TUN/TAP read bytes')) {
        const subTokens = token.split(',');
        read = parseInt(subTokens[1]);
        if (isNaN(read)) {
          read = 0;
        }
      }
      if (token.includes('TUN/TAP write bytes')) {
        const subTokens = token.split(',');
        written = parseInt(subTokens[1]);
        if (isNaN(written)) {
          written = 0;
        }
      }
    }
    written = written / 1024;
    let writtenUnits = 'kb';
    // if (written > 1024) {
      written = written / 1024;
      writtenUnits = 'mb';
    // }
    read = read / 1024;
    let readUnits = 'kb';
    // if (read > 1024) {
      read = read / 1024;
      readUnits = 'mb';
    // }
    // uiSent.textContent = read.toFixed(2) + readUnits;
    // uiReceived.textContent = written.toFixed(2) + writtenUnits;
    // uiUptime.textContent = timeDifference(Date.now(), connectedBeginTime);
    const usage = read + written;
    const mainWindow = BrowserWindow.fromId(1);
    mainWindow.webContents.send('vpnUsage', usage);
    // console.log(usage);

    publicIp
      .v4()
      .then((ip) => {
        dnsTimeoutCount = 0;
        if (updateOpenVPNStatsTimeout) {
          // uiIP.textContent = ip;
        }
      })
      .catch((e) => {
        if (updateOpenVPNStatsTimeout && dnsTimeoutCount++ > 2) {
          log('DNS Error: ' + e.toString(), true);
          disconnectOpenVPN();
          // killSwitch();
        }
      });
  }
};

const onDisconnectedCallback = (onDisconnected) => {
  // console.log("Call: onDisconnectedCallback(" + onDisconnected + "," + withoutPass + ")");
  if (onDisconnected) {
    onDisconnected();
  }
};

export const disconnectOpenVPN = (
  onDisconnected = null,
  timeout = 2000,
  withoutPass = false,
  failed = false
) => {
  // console.log("Call: disconnectOpenVPN(" + onDisconnected + "," + timeout + "," + withoutPass + ")");
  const mainWindow = BrowserWindow.fromId(1);

  if (openvpn) {
    const promiseUpdateStats = new Promise((resolve) => {
      updateOpenVPNStats();
      resolve();
    });
    promiseUpdateStats.then(() => {
      if (process.platform == 'win32') {
        clearInterval(updateOpenVPNStatsTimeout);
        dnsTimeoutCount = 0;
        updateOpenVPNStatsTimeout = null;
        fpOpenVPNStats = null;
        openvpn.kill('SIGINT');
        openvpn = null;
        setTimeout(() => {
          // console.log("Timeout: disconnectOpenVPN " + timeout + "ms");
          onDisconnectedCallback(onDisconnected);
        }, timeout);
      } else {
        clearInterval(updateOpenVPNStatsTimeout);
        dnsTimeoutCount = 0;
        updateOpenVPNStatsTimeout = null;
        fpOpenVPNStats = null;
        fs.unwatchFile(fpOpenVpnLog);
        sudo.exec(
          'pkill -SIGINT openvpn',
          { name: 'Retron VPN' },
          (error, stdout, stderr) => {
            if (error) log('err:' + error.toString(), true);
            if (stdout) log('stdout: ' + stdout.toString(), false);
            if (stderr) {
              const msg = stderr.toString();
              log('stderr: ' + msg, true);
              if (msg.includes('Request dismissed')) {
                return;
              }
            }
            if (!error) {
              openvpn = null;
              onDisconnectedCallback(onDisconnected);
            }
          }
        );
      }

      if (failed) {
        mainWindow.webContents.send('vpnConnection', 'failed');
      } else {
        mainWindow.webContents.send('vpnConnection', 'disconnected');
      }
    });
  } else {
    if (failed) {
      mainWindow.webContents.send('vpnConnection', 'failed');
    } else {
      mainWindow.webContents.send('vpnConnection', 'disconnected');
    }
  }
};

const logout = (removeUserFile) => {
  // console.log("Call: logout(" + removeUserFile + ")");
  if (tmpCredentials) {
    fs.closeSync(tmpCredentials.fd);
    if (removeUserFile) {
      fs.unlinkSync(tmpCredentials.name);
    }
    tmpCredentials = null;
  }
};

const getPidByName = (name) => {
  let foundPid = 0;
  ps.lookup(
    {
      command: name,
      /* arguments: args, */
    },
    (err, resultList) => {
      if (err) {
        throw new Error(err);
      }
      /* resultList.forEach(function(process) {
          if(process) {
              console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
          }
      }); */
      if (resultList) {
        if (resultList[0]) foundPid = resultList[0].pid;
      }
    }
  );
  return foundPid;
};

const onConnectedCallback = () => {
  // console.log("Call: onConnectedCallback(" + withoutPass + ")");
  if (openvpn != null) {
    const mainWindow = BrowserWindow.fromId(1);
    mainWindow.webContents.send('vpnConnection', 'connected');

    if (connectedOnce == false) {
      connectedOnce = true;
      connectTimeoutMillisec = 8000;
    }
    connectedBeginTime = Date.now();
    if (updateOpenVPNStatsTimeout == null) {
      // updateOpenVPNStatsTimeout = setInterval(updateOpenVPNStats, 5000);
      updateOpenVPNStatsTimeout = setInterval(updateOpenVPNStats, 300000);
    }
  }
};

const loadLoginCredentials = (username = null, password = null) => {
  tmpCredentials = tmp.fileSync();
  fs.writeFileSync(tmpCredentials.fd, `${username}\n${password}`);
};

const connectOpenVPN = (withoutPass) => {
  if (openvpn) {
    return;
  }

  const ovpnPath = ovpnDir + ovpnFileName;
  fpOpenVPNStats = miscDir + 'OpenVPN.status';

  if (process.platform == 'win32') {
    let args = [];

    if (withoutPass) {
      args = [
        '--verb',
        '11',
        '--config',
        ovpnPath,
        '--status',
        fpOpenVPNStats,
        '1',
        '--auth-nocache',
        '--inactive',
        '3600',
        '--ping',
        '1',
        '--ping-exit',
        '5',
      ];
    } else {
      args = [
        '--verb',
        '11',
        '--config',
        ovpnPath,
        '--auth-user-pass',
        tmpCredentials.name,
        '--status',
        fpOpenVPNStats,
        '1',
        '--auth-nocache',
        '--inactive',
        '3600',
        '--ping',
        '1',
        '--ping-exit',
        '5',
      ];
    }

    const cmd = openVPNExecCmd + ' ' + args.join(' ');
    log('starting ' + cmd, true);
    openvpn = spawn(openVPNExecCmd, args);
    openvpn.on('error', (err) => {
      log('error: ' + err, true);
      disconnectOpenVPN(null, 2000, withoutPass);
    });
    openvpn.stdout.on('data', (data) => {
      const msg = data.toString();
      log('stdout: ' + msg, true);
      if (
        msg.includes('SIGTERM') ||
        msg.includes('error') ||
        msg.includes('AUTH_FAILED') ||
        msg.includes('authfile') ||
        msg.includes('Enter Auth Username')
      ) {
        clearTimeout(connectingTimeout);
        // uiLoginStatus.textContent = withoutPass
        //   ? 'Required valid credentials'
        //   : 'Invalid username or password';
        disconnectOpenVPN(null, 2000, withoutPass, true);
        logout(true);
      }
    });
    openvpn.stderr.on('data', (data) => {
      const msg = data.toString();
      log('stderr: ' + msg, true);
      if (
        msg.includes('SIGTERM') ||
        msg.includes('error') ||
        msg.includes('AUTH_FAILED') ||
        msg.includes('authfile') ||
        msg.includes('Enter Auth Username')
      ) {
        clearTimeout(connectingTimeout);
        // uiLoginStatus.textContent = withoutPass
        //   ? 'Required valid credentials'
        //   : 'Invalid username or password';
        disconnectOpenVPN(null, 2000, withoutPass, true);
        logout(true);
      }
      disconnectOpenVPN(null, 2000, withoutPass);
    });
    openvpn.on('close', (code) => {
      log(`child process exited with code ${code}`, true);
      if (code === null) {
        disconnectOpenVPN(null, 2000, withoutPass);
      } else {
        disconnectOpenVPN(null, 2000, withoutPass, true);
      }
    });
    openvpnPID = getPidByName('openvpn');
    connectingTimeout = setTimeout(() => {
      // console.log('Timeout: connectOpenVPN ' + connectTimeoutMillisec + 'ms');
      onConnectedCallback();
    }, connectTimeoutMillisec);
  } else {
    // darwin, linux
    const resetConnection = () => {
      // console.log('Call(local): resetConnection');
      clearTimeout(connectingTimeout);
      connectingTimeout = null;
      clearInterval(updateOpenVPNStatsTimeout);
      dnsTimeoutCount = 0;
      updateOpenVPNStatsTimeout = null;
      openvpn = null;
      disconnectOpenVPN(null, 2000, withoutPass, true);
    };
    fpOpenVpnLog = miscDir + 'OpenVPN.log';
    const cmd =
      '"' +
      openVPNExecCmd +
      '" ' +
      '--daemon retron-vpn ' +
      '--log "' +
      fpOpenVpnLog +
      '" ' +
      '--config "' +
      ovpnPath +
      '" ' +
      (withoutPass ? '' : '--auth-user-pass "' + tmpCredentials.name + '" ') +
      '--auth-nocache ' +
      '--status "' +
      fpOpenVPNStats +
      '" 1 ' +
      '--inactive 3600 --ping 1 --ping-exit 5';
    log('starting ' + cmd, true);
    sudo.exec(cmd, { name: 'Retron VPN' }, (error, stdout, stderr) => {
      if (error) {
        log('err:' + error.toString(), true);
        //console.log("Something went wrong, try again...");
        resetConnection();
      }
      if (stdout) log('stdout: ' + stdout.toString(), false);
      if (stderr) {
        const msg = stderr.toString();
        log('stderr: ' + msg, true);
        if (msg.includes('Request dismissed')) {
          resetConnection();
          return;
        }
      }
      if ((error && stderr) == false) openvpnPID = getPidByName('openvpn');
    });
    fs.watchFile(fpOpenVpnLog, (curr, prev) => {
      log('watching ' + fpOpenVpnLog, true);
      if (curr.mtime > prev.mtime) {
        let msg = fs.readFileSync(fpOpenVpnLog).toString();
        log(msg, true);
        if (
          msg.includes('SIGTERM') ||
          msg.includes('error') ||
          msg.includes('AUTH_FAILED') ||
          msg.includes('authfile') ||
          msg.includes('Enter Auth Username')
        ) {
          // uiLoginStatus.textContent = withoutPass
          //   ? 'Required valid credentials'
          //   : 'Invalid username or password';
          resetConnection();
          logout(true);
        } else if (openvpn == null) {
          openvpn = {};
          connectingTimeout = setTimeout(() => {
            // console.log(
            //   'Timeout: connectOpenVPN ' + connectTimeoutMillisec + 'ms'
            // );
            onConnectedCallback();
          }, connectTimeoutMillisec);
          //log("connected", true);
          //onConnectedCallback(); // Success
        }
        msg = null;
      }
    });
  }
};

export const connectVpn = (server) => {
  // console.log("Click: connect button");
  ovpnFileName = 'server.ovpn';
  fs.writeFileSync(ovpnDir + ovpnFileName, server.config);

  if (server.username === null && server.password === null) {
    // console.log("Click: login without pass");
    connectOpenVPN(true);
  } else {
    loadLoginCredentials(server.username, server.password);
    connectOpenVPN(false);
  }
};

const installOpenVpn = () => {
  log('platfrom: ' + process.platform, true);
  if (process.platform == 'win32') {
    if (fs.existsSync('C:\\Program Files\\OpenVPN\\bin\\openvpn.exe')) {
      openVPNExecCmd = 'C:\\Program Files\\OpenVPN\\bin\\openvpn.exe';
      log('OpenVPN found at "' + openVPNExecCmd + '"', true);
    } else if (
      fs.existsSync('C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe')
    ) {
      openVPNExecCmd = 'C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe';
      log('OpenVPN found at "' + openVPNExecCmd + '"', true);
    } else {
      const installer = spawn(resourcesDir + 'openvpn-win32.exe', [
        '/S',
        '/SELECT_SHORTCUTS=0',
        '/SELECT_OPENVPN=1',
        '/SELECT_SERVICE=1',
        '/SELECT_TAP=1',
        '/SELECT_OPENVPNGUI=0',
        '/SELECT_ASSOCIATIONS=1',
        '/SELECT_OPENSSL_UTILITIES=0',
        '/SELECT_EASYRSA=0',
        '/SELECT_PATH=1',
        '/SELECT_OPENSSLDLLS=1',
        '/SELECT_LZODLLS=1',
        '/SELECT_PKCS11DLLS=1',
        '/D',
        'C:\\Program Files\\OpenVPN',
      ]);
      installer.on('error', (err) => {
        log('installer:error: ' + err, true);
      });
      installer.stdout.on('data', (data) => {
        let msg = data.toString();
        log('installer:stdout: ' + msg, true);
      });
      installer.stderr.on('data', (data) => {
        let msg = data.toString();
        log('installer:stderr: ' + msg, true);
      });
      installer.on('close', (code) => {
        log(`installer: child process exited with code ${code}`, true);
        if (fs.existsSync('C:\\Program Files\\OpenVPN\\bin\\openvpn.exe')) {
          openVPNExecCmd = 'C:\\Program Files\\OpenVPN\\bin\\openvpn.exe';
          log('OpenVPN intalled at "' + openVPNExecCmd + '"', true);
        } else if (
          fs.existsSync('C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe')
        ) {
          openVPNExecCmd = 'C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe';
          log('OpenVPN intalled at "' + openVPNExecCmd + '"', true);
        } else {
          log('OpenVPN installation failed. Please install OpenVPN', true);
        }
      });
    }
  }
  if (process.platform == 'darwin') {
    // Exec bash install script from "./resources/app/openvpn-install-2.4.6-I602"?
    /*var absPath = path.resolve(openVPNExecCmd);
    log(absPath, true);
    if (absPath.length == 0) {*/
    openVPNExecCmd = path.resolve(resourcesDir + 'openvpn-darwin');
    // console.log('openvpn exec command: ' + openVPNExecCmd);
    //}
  }
  if (process.platform == 'linux') {
    let IsOpenvpnInstalled = false;
    // let trySpawnOpenVpn = spawn(openVPNExecCmd, [""], {/*uid:0, gid:0,*/ shell:true}); // spawn("sudo", ["apt-get", "install", "openvpn"]);
    const trySpawnOpenVpn = spawn(openVPNExecCmd, ['--version'], {
      shell: true,
    });
    trySpawnOpenVpn.on('error', (err) => {
      log('error: ' + err, true);
    });
    trySpawnOpenVpn.stdout.on('data', (data) => {
      const msg = data.toString();
      log('stdout: ' + msg, true);
      IsOpenvpnInstalled = true;
    });
    trySpawnOpenVpn.stderr.on('data', (data) => {
      const msg = data.toString();
      log('stderr: ' + msg, true);
    });
    trySpawnOpenVpn.on('close', (code) => {
      log(`child process exited with code ${code}`, true);
      if (IsOpenvpnInstalled) {
        log('openvpn is already installed', true);
      } else {
        log('installing openvpn...', true);
        const aptGetInstallCmd = 'apt-get --yes install openvpn'; // --force-yes --allow-downgrades --allow-remove-essential --allow-change-held-packages
        log(aptGetInstallCmd, true);
        sudo.exec(
          aptGetInstallCmd,
          { name: 'Retron VPN' },
          (error, stdout, stderr) => {
            if (error) log('err:' + error.toString(), true);
            if (stdout) log('stdout: ' + stdout.toString(), false);
            if (stderr) log('stderr: ' + stderr.toString(), true);
          }
        );
      }
    });
  }
};
installOpenVpn();
