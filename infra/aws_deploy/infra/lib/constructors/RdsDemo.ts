import { Vpc, SecurityGroup, Port } from "@aws-cdk/aws-ec2";
import { Construct, Duration, RemovalPolicy, StackProps } from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";

import secretsManager = require("@aws-cdk/aws-secretsmanager");
import { config } from "../../config";

interface CustomStackProps extends StackProps {
  vpc: Vpc;
}

export class RdsDemo {
  public readonly databaseHost: rds.Endpoint;
  public readonly databaseUsername: string;
  public readonly databasePassword: string;

  constructor(scope: Construct, props: CustomStackProps) {

    const {vpc} = props;

    const databaseCredentialsSecret = new secretsManager.Secret(
      scope,
      "DBCredentialsSecret",
      {
        secretName: `demo-${config.environment}-credentials`,
        description: "Credentials to access Wordpress MYSQL Database on RDS",
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ username: config.dbUser }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    );

    const dbClusterSecurityGroup = new SecurityGroup(
      scope,
      "DBClusterSecurityGroup",
      { vpc }
    );
    dbClusterSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(config.dbPort)
    );

    const rdsCluster = new rds.ServerlessCluster(scope, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_14,
      }),
      credentials: rds.Credentials.fromSecret(databaseCredentialsSecret),
      defaultDatabaseName: config.dbName,

      vpc: vpc,
      securityGroups: [dbClusterSecurityGroup],
      deletionProtection: false,
      removalPolicy: RemovalPolicy.DESTROY,
      scaling: {
        autoPause: Duration.hours(3),
        maxCapacity: 4,
        minCapacity: 2,
      },
    });

    this.databaseHost = rdsCluster.clusterEndpoint;
    this.databaseUsername = databaseCredentialsSecret
      .secretValueFromJson("username")
      .toString();
    this.databasePassword = databaseCredentialsSecret
      .secretValueFromJson("password")
      .toString();
  }
}