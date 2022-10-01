const klaytn_config = {
  // UniV2Factory: (factory, fee, wklay)
  UniV2Factories: {
    Klayswap: ['0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654', 3000, '0x0000000000000000000000000000000000000000'],
    Claimswap: ['0x3679c3766E70133Ee4A7eb76031E49d3d1f2B50c', 3000, '0xe4f05A66Ec68B54A58B17c22107b02e0232cC817'],
    Pala: ['0xa25ba09d8837f6319cd65b2345c0bbea99c39cb1', 2000, '0x2ff5f6dE2287CA3075232127277E53519A77947C'],
    Ufoswap: ['0x165e04633A90ef31fc25958fffbD15966eCfe929', 2500, '0x8DfbB066e2881C85749cCe3d9ea5c7F1335b46aE'],
    Definix: ['0xdEe3df2560BCEb55d3d7EF12F76DCb01785E6b29', 2500, '0x5819b6af194A78511c79C85Ea68D2377a7e9335f'],
    Neuronswap: ['0xe334e8c7073e9AaAE3cab998EECcA33F56df6621', 3000, '0xfd844c2fcA5e595004b17615f891620d1cB9bBB2'],
    Roundrobin: ['0x01D43Af9c2A1e9c5D542c2299Fe5826A357Eb3fe', 3000, '0xF01f433268C277535743231C95c8e46783746D30'],
  },

  //CurveRegistry
  CurveStableRegistry: '0x0000000000000000000000000000000000000000',
  CurveCryptoRegistry: '0x0000000000000000000000000000000000000000',
  // get curve factory registry from exchange
  // registry -> only factory ele!=address(0) at idx=0
  CurveFactoryRegistry: '0x0000000000000000000000000000000000000000',
  // 2 coins
  CurveCryptoFactoryRegistry: '0x0000000000000000000000000000000000000000',

  //UniV3
  TickLens: '0x0000000000000000000000000000000000000000',

  //Should deploy contracts below
  //Approve
  Approve: '0x1D29C0819A6Bc066C859F6CDB05A0C7a4E00B9dd',
  err: '0xc75406f11cF2E638830f1f2822BC3ff12cAA0186',
  //Adapter
  UniV2Adapter: '0xcC59a96DDBd08bDA63163b0C4046326796cBE56c',
  UniV3Adapter: '0x0000000000000000000000000000000000000000',
  // for curve
  CurveAdapter: '0x0000000000000000000000000000000000000000',
  // for kinesis swap
  StableSwapNoRegistryAdapter: '0xAA6c5F0B52D66bFBde1A0C8dcB478D9e50A53190',
  // for saddle swap fork()
  StableSwapAdapter: '0xEcD4f5288971886cB29899A278c7A36e823D9025',
  BalancerAdapter: '0x0000000000000000000000000000000000000000',

  //Viewer
  UniV2Viewer: '0xE5406aeb878a341656E8c6A2E16d0b07728F5977',
  UniV3Viewer: '0x0000000000000000000000000000000000000000',
  CurveViewer: '0x0000000000000000000000000000000000000000',
  CurveNoRegistryViewer: '0x0000000000000000000000000000000000000000',
  StableSwapViewer: '0x7B0A49EcDE59e2943489bA8Bfb285c3b31611423',
  CurveCryptoViewer: '0x0000000000000000000000000000000000000000',
  BalancerViewer: '0x0000000000000000000000000000000000000000',
  TokenViewer: '0xEfbA9791DfDf14844a3Cb2b31F28365F8123193a',

  //Proxy
  RouteProxy: '0xC926D433BD6B51E1ACcD7c1F1e7ce3101c03D3A0',
  ApproveProxy: '0x19f6f1e909A8F9E3d31C2eFcb5274f8f86226eb8',

  //Tokens
  // WETH is eth, xxWETH is wEvmos(we don't have to calculate in assumption; xxWETH=ooWETH)
  Tokens: {
    KLAY: {
      address: '0x0000000000000000000000000000000000000000',
      decimal: 18,
    },
    oUSDT: {
      address: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
      decimal: 6,
    },
    kDAI: {
      address: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
      decimal: 18,
    },
    MBX: {
      address: '0xd068c52d81f4409b9502da926ace3301cc41f623',
      decimal: 18,
    },
  },

  BalancerPools: [],
  CurvePools: [],
  // stable swap
  SaddlePools: [
    '0x1275203FB58Fc25bC6963B13C2a1ED1541563aF0',
    '0x21d4365834B7c61447e142ef6bCf01136cBD01c6',
    '0x81272C5c573919eF0C719D6d63317a4629F161da',
  ],
  // Only base pools(saddle)
  KinesisSaddlePools: ['0x49b97224655AaD13832296b8f6185231AFB8aaCc', '0xbBD5a7AE45a484BD8dAbdfeeeb33E4b859D2c95C'],
  UniswapV3Pools: [],
};

export { klaytn_config as config };
