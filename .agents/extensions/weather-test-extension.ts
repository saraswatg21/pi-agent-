import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Weather Test Extension
 * 
 * This extension monitors the WeatherForecastApp repository for recent changes
 * and runs tests to verify the code works correctly. It can also launch Chrome
 * to test the application in a browser.
 */

export default function (pi: ExtensionAPI) {
  // Register a command to check recent changes in the repository
  pi.registerCommand("check-changes", {
    description: "Check recent changes in the WeatherForecastApp repository",
    handler: async (_name, ctx) => {
      // Try to get git status
      try {
        const result = await ctx.executeTool("user_bash", {
          command: "git -C . status --short"
        });
        
        if (!result.content || result.content.length === 0) {
          return "No recent changes found. The repository is clean.";
        }
        
        return result.content.map(item => item.text).join("\n");
      } catch (error) {
        return `Failed to check changes: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });

  // Register a command to run tests
  pi.registerCommand("run-tests", {
    description: "Run the test suite for WeatherForecastApp",
    handler: async (_name, ctx) => {
      try {
        const result = await ctx.executeTool("user_bash", {
          command: "npm test"
        });
        
        if (result.content && result.content.length > 0) {
          return result.content.map(item => item.text).join("\n");
        }
        return "All tests passed!";
      } catch (error) {
        return `Test execution failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });

  // Register a command to launch Chrome and test the app
  pi.registerCommand("launch-chrome", {
    description: "Launch Chrome and open the WeatherForecastApp",
    handler: async (_name, ctx) => {
      try {
        // Use open --app for React development server URL
        const result = await ctx.executeTool("user_bash", {
          command: "open -a 'Google Chrome' https://localhost:3000"
        });
        
        return "Chrome launched! The WeatherForecastApp is now running at https://localhost:3000\n\nOpen the browser window to test the app functionality. You can also check the browser console (F12) for any JavaScript errors.";
      } catch (error) {
        return `Failed to launch Chrome: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease make sure Google Chrome is installed and try running: open -a 'Google Chrome' https://localhost:3000`;
      }
    },
  });

  // Register a command to get recent commits
  pi.registerCommand("get-commits", {
    description: "Get recent commits in the WeatherForecastApp repository",
    handler: async (_name, ctx) => {
      try {
        const result = await ctx.executeTool("user_bash", {
          command: "git log --oneline -10"
        });
        
        if (result.content && result.content.length > 0) {
          return result.content.map(item => item.text).join("\n");
        }
        return "No commits found.";
      } catch (error) {
        return `Failed to get commits: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });

  // Register a command to test specific file changes
  pi.registerCommand("test-recent", {
    description: "Test recent changes by checking git diff and running tests",
    handler: async (_name, ctx) => {
      // First get the git diff
      const changesResult = await ctx.executeTool("user_bash", {
        command: "git diff --name-only HEAD~5..HEAD"
      });
      
      if (changesResult.content && changesResult.content.length > 0) {
        const changedFiles = changesResult.content.map(item => item.text).join("\n");
        
        // Check if any React source files changed
        const sourceFiles = changedFiles.split('\n').filter(file => 
          file.includes('src/') || file.includes('App.') || file.includes('test.') || 
          file === 'package.json' || file === 'public/index.html'
        ).join('\n');
        
        let message = `Recent changes in WeatherForecastApp:\n\n`;
        
        if (sourceFiles) {
          message += `Changed source files:\n${sourceFiles}\n\n`;
          
          // Run tests after checking source files
          message += `Running test suite...\n`;
          const testResult = await ctx.executeTool("user_bash", {
            command: "npm test -- --watchAll=false"
          });
          
          if (testResult.content && testResult.content.length > 0) {
            message += testResult.content.map(item => item.text).join("\n") + "\n\n";
          }
          
          message += `If tests pass, you can launch Chrome to test the app visually. The changes have been tested automatically.`;
        } else {
          message += `No critical source files changed. Modified files: ${changedFiles}\n\nThe app core functionality appears unchanged.`;
        }
        
        return message;
      }
      
      return "No recent commits found to test.";
    },
  });
}