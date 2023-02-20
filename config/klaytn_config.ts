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

  KlexPools: [
    '0x0e25fd48bcc65d0b0430386badb23c79eb295d28',
    '0x7ba1140505043000e291cafe6baf1ff6686d976f',
  ],

  I4IPoolRegistry: '0xBd21dD5BCFE28475D26154935894d4F515A7b1C0',

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
  Approve: '0x0000000000000000000000000000000000000000',
  err: '0x0000000000000000000000000000000000000000',
  //Adapter
  KlayswapAdapter: '0x29D5991dCF42fa2505bf1D84473Ec382CD3B0EE6',
  IsoAdapter: '0x5Ae877A24b08c5344c30A51608c177b521f9cf52',
  UniV2Adapter: '0x8cB14929A8144cB5d2c7444b909fdC2Ac966e2ca',
  UniV3Adapter: '0x0000000000000000000000000000000000000000',
  // for curve
  I4iAdapter: '0x814760Df2B6a5625119699897F2042a0D4d5b7E0',
  CurveAdapter: '0x0000000000000000000000000000000000000000',
  // for kinesis swap
  StableSwapNoRegistryAdapter: '0x0000000000000000000000000000000000000000',
  // for saddle swap fork()
  StableSwapAdapter: '0x0000000000000000000000000000000000000000',
  BalancerAdapter: '0xF8477de33a9B63bbA4e3BcdF85E35a2893541100',

  //Viewer
  UniV2Viewer: '0x5CCc75A112Eb4e4841Ae50c68810e2f2669cAAF7',
  UniV3Viewer: '0x0000000000000000000000000000000000000000',
  I4iViewer: '0x27E7e04BA1f2bC42fAE62fFfaa157d90d658cb6B',
  CurveViewer: '0x0000000000000000000000000000000000000000',
  CurveNoRegistryViewer: '0x0000000000000000000000000000000000000000',
  StableSwapViewer: '0x0000000000000000000000000000000000000000',
  CurveCryptoViewer: '0x0000000000000000000000000000000000000000',
  BalancerViewer: '0x754E57832940844CfEBad75ef6c822b860c4eb61',
  TokenViewer: '0x06a0602225D3b50a4E160dC453cC0E372dF1454d',

  //Proxy
  RouteProxy: '0x637163E43ee7E2791F9E8b830A476d8921600a39',
  ApproveProxy: '0x0000000000000000000000000000000000000000',

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
    oUSDC: {
      address: '0x754288077D0fF82AF7a5317C7CB8c444D421d103',
      decimal: 6,
    },
    kDAI: {
      address: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
      decimal: 18,
    },
    '4NUTS': {
      address: '0x22e3aC1e6595B64266e0b062E01faE31d9cdD578',
      decimal: 18,
    },
    MBX: {
      address: '0xd068c52d81f4409b9502da926ace3301cc41f623',
      decimal: 18,
    },
  },

  Klap: {
    LendingPool: '0x1b9c074111ec65E1342Ea844f7273D5449D2194B',
    Klay: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    Wklay: '0xe4f05a66ec68b54a58b17c22107b02e0232cc817',
    Aklay: '0x5BC2785782C0bba162C78a76F0eE308ec5f601B7',
    AUSDC: '0x7D274dce8E2467fc4cdb6E8e1755db5686DAEBBb',
    USDC: '0x6270b58be569a7c0b8f47594f191631ae5b2c86c',
    WormUSDC: '0x608792deb376cce1c9fa4d0e6b7b44f507cffa6a',
    KlayDeptUsers: [
      {
        Addr: '0x016b3594e33854efb8f6ae3d861671a94698882e',
        Collat: '0x6270b58be569a7c0b8f47594f191631ae5b2c86c',
      },
      {
        Addr: '0x016b3594e33854efb8f6ae3d861671a94698882e',
        Collat: '0x608792deb376cce1c9fa4d0e6b7b44f507cffa6a',
      },
      {
        Addr: '0xe4e406171bcbf0b9b1ff990691c289b20471b654',
        Collat: '0x6270b58be569a7c0b8f47594f191631ae5b2c86c',
      },
      {
        Addr: '0x4a1adc5b4bd5f7bd47a8a08025b8c38851dc5b76',
        Collat: '0x608792deb376cce1c9fa4d0e6b7b44f507cffa6a',
      },
    ],
  },
};

export { klaytn_config as config };
