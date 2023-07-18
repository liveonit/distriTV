import { StackProps, Construct, RemovalPolicy, CfnOutput } from "@aws-cdk/core";
import { BlockPublicAccess, Bucket, HttpMethods } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as path from "path";

import {
  OriginAccessIdentity,
  AllowedMethods,
  ViewerProtocolPolicy,
  OriginProtocolPolicy,
  Distribution,
  CachePolicy,
} from "@aws-cdk/aws-cloudfront";

interface CustomStackProps extends StackProps {
  albEndpoint: string;
}

export class CloudfrontDemo {
  constructor(scope: Construct, props: CustomStackProps) {
    // Web hosting bucket
    let websiteBucket = new Bucket(scope, "websiteBucket", {
      versioned: false,
      removalPolicy: RemovalPolicy.RETAIN,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [HttpMethods.GET],
        },
      ],
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(
      scope,
      "cloudfrontOAI",
      {
        comment: "OAI for web application cloudfront distribution",
      }
    );
    websiteBucket.grantRead(originAccessIdentity);

    // Creating CloudFront distribution
    let cloudFrontDist = new Distribution(scope, "cloudfrontDist", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      },
    });

    // Trigger frontend deployment
    new BucketDeployment(scope, "websiteDeployment", {
      sources: [
        Source.asset(
          path.resolve(__dirname, "../../../../../services/dashboard/dist")
        ),
      ],
      destinationBucket: websiteBucket as any,
      distribution: cloudFrontDist,
      distributionPaths: ["/*"],
    });

    // Creating custom origin for the application load balancer
    const loadBalancerOrigin = new origins.HttpOrigin(props.albEndpoint, {
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
    });

    // Creating the path pattern to direct to the load balancer origin
    cloudFrontDist.addBehavior("/graphql", loadBalancerOrigin as any, {
      cachePolicy: CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      allowedMethods: AllowedMethods.ALLOW_ALL,
    });

    cloudFrontDist.addBehavior("/healthz", loadBalancerOrigin as any, {
      cachePolicy: CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      allowedMethods: AllowedMethods.ALLOW_ALL,
    });

    new CfnOutput(scope, "cloudfrontDomainUrl", {
      value: cloudFrontDist.distributionDomainName,
      exportName: "cloudfrontDomainUrl",
    });
  }
}
