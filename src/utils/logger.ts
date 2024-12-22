import fs from 'fs';
import path from 'path';

export const logUsername = async (username: string) => {
  const logEntry = `${new Date().toISOString()} - ${username}\n`;
  const logPath = path.join(process.cwd(), 'usernames.log');
  
  try {
    await fs.promises.appendFile(logPath, logEntry);
  } catch (error) {
    console.error('Failed to log username:', error);
  }
}; 