import { expect } from 'chai';
import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';

export function swapKlayswapAdapter(): void {
  it('swap 1 KLAY -> kDAI -> MBX -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const output = await this.klayswapAdapter.callStatic.swapExactIn(
      config.Tokens.KLAY.address,
      ethers.utils.parseUnits('1', config.Tokens.KLAY.decimal),
      config.Tokens.oUSDT.address,
      abi.encode(['address[]'], [[config.Tokens.kDAI.address, config.Tokens.MBX.address]]),
      this.signers.admin.address,
      {
        value: ethers.utils.parseUnits('1', config.Tokens.KLAY.decimal),
      },
    );

    console.log('oUSDT:', ethers.utils.formatUnits(output, config.Tokens.oUSDT.decimal));
  });
}
