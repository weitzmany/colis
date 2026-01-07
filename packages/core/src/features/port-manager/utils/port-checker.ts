/**
 * Port Checker Utilities
 * 
 * Helper functions for checking port availability.
 */

import * as net from 'net';

export class PortChecker {
  /**
   * Check if a port is available (not in use)
   */
  static async isAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  }

  /**
   * Check if a port is in use
   */
  static async isInUse(port: number): Promise<boolean> {
    return !(await this.isAvailable(port));
  }

  /**
   * Find next available port starting from a given port
   */
  static async findNextAvailable(startPort: number, maxAttempts: number = 100): Promise<number | null> {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      if (await this.isAvailable(port)) {
        return port;
      }
    }
    return null;
  }
}




