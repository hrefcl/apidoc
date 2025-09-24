#!/usr/bin/env node

// Comprehensive test to simulate real user experience
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🧪 Running comprehensive integration test...');
console.log('   This simulates a real user installing and using the package\n');

// Create a temporary directory to simulate user environment
const testDir = path.join(os.tmpdir(), `apidoc-test-${Date.now()}`);
fs.mkdirSync(testDir, { recursive: true });

console.log(`📁 Created test directory: ${testDir}`);

try {
  // Change to test directory
  process.chdir(testDir);

  // Initialize a fake project
  console.log('📦 Initializing test project...');
  execSync('npm init -y', { encoding: 'utf8' });

  // Create test API files
  console.log('📝 Creating test API files...');
  fs.mkdirSync('./src', { recursive: true });

  const testApiFile = `
/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup User
 * @apiParam {Number} id User ID
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 */

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 */
`;

  fs.writeFileSync('./src/users.js', testApiFile);

  // Create apidoc.json
  const apidocConfig = {
    name: "Test API",
    version: "1.0.0",
    description: "Test API documentation",
    title: "Test API",
    url: "https://api.test.com"
  };

  fs.writeFileSync('./apidoc.json', JSON.stringify(apidocConfig, null, 2));

  // Now install our package from the registry
  console.log('📥 Installing @hrefcl/apidoc@beta...');
  const installOutput = execSync('npm install @hrefcl/apidoc@beta', { encoding: 'utf8' });
  console.log('   Installation output:', installOutput.split('\n')[0]);

  // Test running apidoc
  console.log('🚀 Running apidoc on test project...');

  const apidocCommand = path.join(testDir, 'node_modules/.bin/apidoc');
  const apidocOutput = execSync(`"${apidocCommand}" -i src -o docs`, {
    encoding: 'utf8',
    stdio: 'pipe'
  });

  console.log('✅ Command executed successfully');

  // Check outputs
  if (fs.existsSync('./docs/index.html')) {
    console.log('✅ HTML documentation generated');
  } else {
    throw new Error('HTML documentation not found');
  }

  if (fs.existsSync('./docs/assets/main.bundle.js')) {
    console.log('✅ JavaScript bundle generated');
  } else {
    throw new Error('JavaScript bundle not found');
  }

  if (fs.existsSync('./docs/assets/main.bundle.css')) {
    console.log('✅ CSS bundle generated');
  } else {
    throw new Error('CSS bundle not found');
  }

  // Check that the HTML contains our test data
  const htmlContent = fs.readFileSync('./docs/index.html', 'utf8');
  if (htmlContent.includes('GetUser') && htmlContent.includes('CreateUser')) {
    console.log('✅ API documentation content verified');
  } else {
    throw new Error('API documentation content not found in HTML');
  }

  console.log('\n🎉 All comprehensive tests passed!');
  console.log('   The package works correctly in a real user environment');

} catch (error) {
  console.error('\n❌ Comprehensive test failed:');
  console.error(error.message);
  if (error.stdout) {
    console.error('STDOUT:', error.stdout.toString());
  }
  if (error.stderr) {
    console.error('STDERR:', error.stderr.toString());
  }
  process.exit(1);
} finally {
  // Cleanup - go back to original directory
  process.chdir(__dirname);

  // Clean up test directory
  try {
    fs.rmSync(testDir, { recursive: true, force: true });
    console.log(`\n🧹 Cleaned up test directory: ${testDir}`);
  } catch (cleanupError) {
    console.warn('Warning: Could not clean up test directory:', cleanupError.message);
  }
}