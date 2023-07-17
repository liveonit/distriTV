import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { config } from "dotenv";
import { CloudfrontDemo } from "./constructors/CloudfrontDemo";
import { FargateDemo } from "./constructors/FargateDemo";
import { RdsDemo } from "./constructors/RdsDemo";
import { VpcDemo } from "./constructors/VpcDemo";


export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpcDemo = new VpcDemo(this, {
        ...props,
      });
      
      const db = new RdsDemo(this, {
        vpc: vpcDemo.vpc
      });
      
      const backend = new FargateDemo(this, {
        ...props,
        vpc: vpcDemo.vpc,
        dbHost: db.databaseHost,
        dbPassword: db.databasePassword,
        dbUser: db.databaseUsername
      });
      
      new CloudfrontDemo(this, {
        ...props,
        albEndpoint: backend.backendService.loadBalancer.loadBalancerDnsName,
      });
      
  }
}
