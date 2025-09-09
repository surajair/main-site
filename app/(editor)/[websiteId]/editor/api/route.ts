import { loadSiteGlobalData } from "@/data/global";
import { builderApiHandler, registerChaiGlobalDataProvider } from "chai-next/server";

registerChaiGlobalDataProvider(loadSiteGlobalData);

const handler: any = builderApiHandler();

export { handler as POST };
