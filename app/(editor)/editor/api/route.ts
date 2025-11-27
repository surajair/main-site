import { loadSiteGlobalData } from "@/data/global";
import { builderApiHandler, registerChaiGlobalDataProvider } from "chai-next/server";

registerChaiGlobalDataProvider(loadSiteGlobalData);
const handler: any = builderApiHandler(process.env.CHAIBUILDER_APP_ID!);

export { handler as POST };
