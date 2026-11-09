import { networkInterfaces } from "node:os";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer from 1 to 65535");
}
console.log(`On this computer: http://localhost:${port}`);
for (const [name, addresses] of Object.entries(networkInterfaces())) {
  if (/^(docker|veth|br-|virbr|lo)/.test(name)) continue;
  for (const address of addresses ?? []) {
    if (address.family === "IPv4" && !address.internal) {
      console.log(
        `Phone on the same network (${name}): http://${address.address}:${port}`,
      );
    }
  }
}
console.log(
  "Start the site with npm run dev, or npm run build followed by npm start.",
);
