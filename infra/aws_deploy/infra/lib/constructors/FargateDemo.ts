import { Vpc } from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { Cluster } from "@aws-cdk/aws-ecs";
import {
  Construct,
  Duration,
  RemovalPolicy,
  StackProps,
  SymlinkFollowMode,
} from "@aws-cdk/core";
import { config, envConfig } from "../../config";
import * as rds from "@aws-cdk/aws-rds";
import { LogGroup, RetentionDays } from "@aws-cdk/aws-logs";
import * as path from "path";

interface CustomStackProps extends StackProps {
  vpc: Vpc;
  dbHost: rds.Endpoint;
  dbUser: string;
  dbPassword: string;
}

export class FargateDemo {
  public readonly backendService: ApplicationLoadBalancedFargateService;
  public readonly ecsCluster: Cluster;
  constructor(scope: Construct, props: CustomStackProps) {
    const { vpc, dbHost, dbUser, dbPassword } = props;

    // Fargate cluster
    this.ecsCluster = new ecs.Cluster(scope, "ecsCluster", {
      vpc: vpc as any,
    });

    const fargateLog = new LogGroup(scope, `${props.stackName}-logs`, {
      logGroupName: `${config.projectName}-logs`,
      retention: RetentionDays.THREE_MONTHS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Fargate service
    this.backendService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        scope,
        "backendService",
        {
          cluster: this.ecsCluster,
          memoryLimitMiB: 1024,
          cpu: 256,
          desiredCount: 1,
          taskImageOptions: {
            image: ecs.ContainerImage.fromAsset(
              path.resolve(__dirname, "../../../../../services/api"),
              {
                followSymlinks: SymlinkFollowMode.ALWAYS,
              }
            ),
            containerPort: config.apiPort,
            environment: {
              ...envConfig,
              DB_HOST: dbHost.hostname,
              DB_USER: dbUser,
              DB_PASSWORD: dbPassword,
              IS_REMOTE_ENV: "true",
            },
            logDriver: ecs.LogDrivers.awsLogs({
              streamPrefix: `${config.projectName}-logStream`,
              logGroup: fargateLog,
            }),
          },
        }
      );

    const scalableTarget = this.backendService.service.autoScaleTaskCount({
      maxCapacity: 3,
    });

    scalableTarget.scaleOnCpuUtilization("CPUScaleUP", {
      targetUtilizationPercent: 80,
      scaleInCooldown: Duration.minutes(5),
      scaleOutCooldown: Duration.minutes(10),
    });

    scalableTarget.scaleOnMemoryUtilization("MemoryScaling", {
      targetUtilizationPercent: 70,
      scaleInCooldown: Duration.minutes(15),
      scaleOutCooldown: Duration.minutes(30),
    });

    // Health check
    this.backendService.targetGroup.configureHealthCheck({
      path: "/healthz",
      healthyThresholdCount: 3,
      unhealthyThresholdCount: 3,
      interval: Duration.seconds(60),
    });
  }
}
