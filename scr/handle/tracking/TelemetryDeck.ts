import { createTelemetryDeck } from "@typedigital/telemetrydeck-react";
import { IsDev } from "../IsDev";
import { TELEMETRY_DECK_KEY } from "../../../keys";

console.log('key tele is dev: ' + IsDev());

const telemetryDeck = createTelemetryDeck({
    appID: TELEMETRY_DECK_KEY,
    clientUser: "anonymous",
    testMode: IsDev(),
});
