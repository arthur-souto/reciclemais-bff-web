// infrastructure/startupBanner.ts
import figlet from "figlet";
import Logger from "../../domain/ports/Logger";

interface StartupInfo {
  appName: string;
  version: string;
  port: number;
  environment: string;
}

// Banner da aplicação
export function logBanner(logger: Logger, info: StartupInfo): void {
  const asciiTitle = figlet.textSync(info.appName, { font: "Standard" });

  console.log("\x1b[32m%s\x1b[0m", asciiTitle); 
  console.log("─".repeat(50));
  console.log(`   Versão:    ${info.version}`);
  console.log(`   Ambiente:  ${info.environment}`);
  console.log(`   Porta:     ${info.port}`);
  console.log(`   Iniciado:  ${new Date().toLocaleString("pt-BR")}`);
  console.log("─".repeat(50) + "\n");

  logger.info("Aplicação iniciada com sucesso", info);
}