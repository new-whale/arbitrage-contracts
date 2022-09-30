import { expect } from 'chai';
import { ethers } from 'hardhat';

// import { config } from '../../config/evmos_config';
// import { logger } from '../logger';

// export function fetchTokenViewer(): void {
//   it("TokenViewer fetch token info of WMATIC", async function () {
//     logger.log("TokenViewer:WMATIC");
//     logger.log(await this.tokenViewer.getTokenMetadata(config.WETH));
//   });
// }

// export function fetchUniV3Viewer(): void {
//   it("UniV3Viewer fetch posol info of WMATIC-USDC fee 0.05%", async function () {
//     logger.log("UniV3Viewer:UniV3");
//     logger.log(
//       await this.uniV3Viewer.connect(this.signers.admin).getPoolInfo("0xA374094527e1673A86dE625aa59517c5dE346d32"),
//     );
//   });
// }

// export function fetchCurveViewer(): void {
//   it("CurveNoRegistryViewer fetch pool info of amWBTC-renBTC", async function () {
//     logger.log("CurveViewer: Saddle pool");
//     logger.log(await this.stableSwapViewer.connect(this.signers.admin).getPoolInfo(config.SaddlePools[0]));
//   });

//   it("StableSwapViewer fetch pool info of Kinesis 3pool", async function () {
//     logger.log("CurveViewer: Kinesis Curve");
//     logger.log(await this.stableSwapViewer.connect(this.signers.admin).getPoolInfo(config.KinesisSaddlePools[0]));
//   });
// }

// export function fetchCurveCryptoViewer(): void {
//   it("CurveCryptoViewer fetch pool info of (DAI-USDC-USDT)-WBTC-WETH", async function () {
//     logger.log("CurveCryptoViewer:Crypto V2 Curve");
//     logger.log(
//       await this.curveCryptoViewer
//         .connect(this.signers.admin)
//         .getPoolInfo("0x92215849c439E1f8612b6646060B4E3E5ef822cC"),
//     );
//   });

//   it("CurveCryptoViewer fetch pool info of stMatic-Matic", async function () {
//     logger.log("CurveCryptoViewer:Crypto Factory Curve");
//     logger.log(
//       await this.curveCryptoViewer
//         .connect(this.signers.admin)
//         .getPoolInfo("0x Fb6FE7802bA9290ef8b00CA16Af4Bc26eb663a28"),
//     );
//   });
// }
// export function fetchBalancerViewer(): void {
//   it("BalancerViewer fetch pool info of WMATIC-USDC", async function () {
//     logger.log("BalancerViewer:Balancer");
//     logger.log(
//       await this.balancerViewer.connect(this.signers.admin).getPoolInfo("0x0297e37f1873D2DAb4487Aa67cD56B58E2F27875"),
//     );
//   });
// }

export function fetchUniV2Viewer(): void {
  it('UniV2 fetch pool info of WMATIC-USDC', async function () {
    const len = await this.uniV2Viewer.allPairsLength('0x3679c3766E70133Ee4A7eb76031E49d3d1f2B50c');
    console.log('Pool num: ', len);

    const pool = await this.uniV2Viewer.getPoolInfo('0x9ddcBC22bEB97899B5ceDCAbbA50A98314c3bAC1');
    console.log('Pool: ', pool);
  });
}
