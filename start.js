const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, cwd, name) {
    const process = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'inherit'
    });

    process.on('error', (err) => {
        console.error(`[${name}] Failed to start: ${err.message}`);
    });

    process.on('close', (code) => {
        console.log(`[${name}] Process exited with code ${code}`);
    });

    return process;
}

console.log('Starting Bank Ads API System...');

// Start Backend
const backend = runCommand('npm', ['start'], path.join(__dirname, 'backend'), 'Backend');

// Start Frontend
const frontend = runCommand('npm', ['run', 'dev'], path.join(__dirname, 'frontend'), 'Frontend');


// Handle termination
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    backend.kill();
    frontend.kill();
    process.exit();
});
