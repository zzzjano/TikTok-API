/**
 * Environment Configuration Validator
 * 
 * Validates required environment variables and provides defaults.
 * Ensures the application has all necessary configuration before starting.
 * 
 * @module utils/configValidator
 */

import fs from 'fs';
import path from 'path';

/**
 * Required environment variables
 * @constant
 * @type {Array<{name: string, description: string, required: boolean}>}
 */
const ENV_VARIABLES = [
    { name: 'PORT', description: 'Server port', required: false, default: '8083' },
    { name: 'USE_TOR', description: 'Enable Tor routing', required: false, default: 'false' },
    { name: 'TOR_HOST', description: 'Tor proxy host', required: false, default: '127.0.0.1' },
    { name: 'TOR_PORT', description: 'Tor proxy port', required: false, default: '9050' },
    { name: 'REQUEST_DELAY_MS', description: 'Request delay in ms', required: false, default: '5000' },
    { name: 'MAX_RETRIES', description: 'Maximum retry attempts', required: false, default: '3' },
    { name: 'RETRY_TIMEOUT_MS', description: 'Retry timeout in ms', required: false, default: '5000' }
];

/**
 * Validate environment configuration
 * 
 * Checks if all required environment variables are set and validates their values.
 * Sets default values for optional variables.
 * 
 * @throws {Error} If required variables are missing or invalid
 * @returns {void}
 */
export const validateEnvironment = () => {
    const errors = [];
    const warnings = [];

    // Check for .env file
    if (!fs.existsSync('.env')) {
        warnings.push('No .env file found. Using default values. Consider creating one from .env.example');
    }

    // Validate each environment variable
    ENV_VARIABLES.forEach(({ name, description, required, default: defaultValue }) => {
        if (!process.env[name]) {
            if (required) {
                errors.push(`Missing required environment variable: ${name} (${description})`);
            } else if (defaultValue) {
                process.env[name] = defaultValue;
                console.log(`[Config] Using default for ${name}: ${defaultValue}`);
            }
        }
    });

    // Check cookies.txt file
    if (!fs.existsSync('cookies.txt')) {
        errors.push('cookies.txt file not found. This file is required for API authentication.');
    }

    // Validate numeric values
    const numericVars = ['PORT', 'TOR_PORT', 'REQUEST_DELAY_MS', 'MAX_RETRIES', 'RETRY_TIMEOUT_MS'];
    numericVars.forEach(varName => {
        const value = process.env[varName];
        if (value && isNaN(parseInt(value, 10))) {
            errors.push(`${varName} must be a valid number, got: ${value}`);
        }
    });

    // Validate boolean values
    const booleanVars = ['USE_TOR', 'TOR_ENABLE_CONTROL_PORT'];
    booleanVars.forEach(varName => {
        const value = process.env[varName];
        if (value && !['true', 'false'].includes(value.toLowerCase())) {
            warnings.push(`${varName} should be 'true' or 'false', got: ${value}`);
        }
    });

    // Print warnings
    if (warnings.length > 0) {
        console.warn('\n⚠️  Configuration Warnings:');
        warnings.forEach(warning => console.warn(`   - ${warning}`));
        console.warn('');
    }

    // Throw errors if any
    if (errors.length > 0) {
        console.error('\n❌ Configuration Errors:');
        errors.forEach(error => console.error(`   - ${error}`));
        console.error('');
        throw new Error('Invalid configuration. Please fix the errors above.');
    }

    console.log('✅ Environment configuration validated successfully\n');
};

/**
 * Print current configuration
 * 
 * Logs the current configuration for debugging purposes.
 * Sensitive values are masked.
 * 
 * @returns {void}
 */
export const printConfiguration = () => {
    console.log('📋 Current Configuration:');
    console.log(`   Server Port: ${process.env.PORT}`);
    console.log(`   Tor Enabled: ${process.env.USE_TOR}`);
    if (process.env.USE_TOR === 'true') {
        console.log(`   Tor Host: ${process.env.TOR_HOST}:${process.env.TOR_PORT}`);
        console.log(`   Tor Control Port: ${process.env.TOR_ENABLE_CONTROL_PORT === 'true' ? 'Enabled' : 'Disabled'}`);
    }
    console.log(`   Request Delay: ${process.env.REQUEST_DELAY_MS}ms`);
    console.log(`   Max Retries: ${process.env.MAX_RETRIES}`);
    console.log('');
};
