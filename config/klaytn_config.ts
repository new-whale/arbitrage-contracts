const klaytn_config = {
  coin: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',

  //UniV2Factory
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
    WEVMOS: {
      address: '0xD4949664cD82660AaE99bEdc034a0deA8A0bd517',
      decimals: 18,
    },
    OSMO: {
      address: '0xFA3C22C069B9556A4B2f7EcE1Ee3B467909f4864',
      decimals: 6,
    },
    ATOM: {
      address: '0xC5e00D3b04563950941f7137B5AfA3a534F0D6d6',
      decimals: 6,
    },
    DIFF: {
      address: '0x3f75ceabCDfed1aCa03257Dc6Bdc0408E2b4b026',
      decimals: 18,
    },
    xDIFF: {
      address: '0x75aeE82a16BD1fB98b11879af93AB7CE055f66Da',
      decimals: 18,
    },
    GRAV: {
      address: '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd',
      decimals: 6,
    },
    gWETH: {
      address: '0xc03345448969Dd8C00e9E4A85d2d9722d093aF8E',
      decimals: 18,
    },
    gUSDC: {
      address: '0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687',
      decimals: 6,
    },
    madDAI: {
      address: '0x63743ACF2c7cfee65A5E356A4C4A005b586fC7AA',
      decimals: 18,
    },
    madWETH: {
      address: '0x5842C5532b61aCF3227679a8b1BD0242a41752f2',
      decimals: 18,
    },
    madWBTC: {
      address: '0xF80699Dc594e00aE7bA200c7533a07C1604A106D',
      decimals: 8,
    },
    madUSDC: {
      address: '0x51e44FfaD5C2B122C8b635671FCC8139dc636E82',
      decimals: 6,
    },
    madUSDT: {
      address: '0x7FF4a56B32ee13D7D4D405887E0eA37d61Ed919e',
      decimals: 6,
    },
    madFRAX: {
      address: '0x28eC4B29657959F4A5052B41079fe32919Ec3Bd3',
      decimals: 18,
    },
    madFXS: {
      address: '0xd0ec216A38F199B0229AE668a96c3Cd9F9f118A6',
      decimals: 18,
    },
    FRAX: {
      address: '0xE03494D0033687543a80c9B1ca7D6237F2EA8BD8',
      decimals: 18,
    },
    FXS: {
      address: '0xd8176865DD0D672c6Ab4A427572f80A72b4B4A9C',
      decimals: 18,
    },
    mulDAI: {
      address: '0x461d52769884ca6235B685EF2040F47d30C94EB5',
      decimals: 18,
    },
    mulWETH: {
      address: '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D',
      decimals: 18,
    },
    mulWBTC: {
      address: '0x332730a4F6E03D9C55829435f10360E13cfA41Ff',
      decimals: 8,
    },
    mulUSDC: {
      address: '0x2C78f1b70Ccf63CDEe49F9233e9fAa99D43AA07e',
      decimals: 6,
    },
    mulUSDT: {
      address: '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4',
      decimals: 6,
    },
    ceDAI: {
      address: '0x940dAAbA3F713abFabD79CdD991466fe698CBe54',
      decimals: 18,
    },
    ceWETH: {
      address: '0x153A59d48AcEAbedbDCf7a13F67Ae52b434B810B',
      decimals: 18,
    },
    ceWBTC: {
      address: '0xb98e169C37ce30Dd47Fdad1f9726Fb832191e60b',
      decimals: 8,
    },
    ceUSDC: {
      address: '0xe46910336479F254723710D57e7b683F3315b22B',
      decimals: 6,
    },
    ceUSDT: {
      address: '0xb72A7567847abA28A2819B855D7fE679D4f59846',
      decimals: 6,
    },
    ceBUSD: {
      address: '0x516e6D96896Aea92cE5e78B0348FD997F13802ad',
      decimals: 18,
    },
    ceBNB: {
      address: '0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4',
      decimals: 18,
    },
    ceAVAX: {
      address: '0x8006320739fC281da67Ee62eB9b4Ef8ADD5C903a',
      decimals: 18,
    },
    ceFTM: {
      address: '0x729416B1F442f204989f1C9f0d58321F878808eD',
      decimals: 18,
    },
    ceAURORA: {
      address: '0x48421FF1c6B93988138130865C4B7Cce10358271',
      decimals: 18,
    },
    CELR: {
      address: '0xFe6998C5c22936CCa749b14Fcf5F190398cfa8F8',
      decimals: 18,
    },
    OAV: {
      address: '0xBbD37BF85f7474b5bDe689695674faB1888565Ad',
      decimals: 18,
    },
    MUSDC: {
      address: '0xc48Efe267a31b5Af4cFDb50C8457914aadB0b875',
      decimals: 18,
    },
    MEVMOS: {
      address: '0xf1361Dc7DFB724bd29FE7ade0CdF9785F2Bc20E6',
      decimals: 18,
    },
    MATOM: {
      address: '0x9832169B33DC5777D3d28572f35E0a537Ff7A04C',
      decimals: 18,
    },
    MOSMOSIS: {
      address: '0x1dccd8025688e39C72f2539C6f00d77bd6678425',
      decimals: 18,
    },
    LHS2: {
      address: '0x7c21d6A51d6f591A95470f1F262C9c804c4CEAc3',
      decimals: 18,
    },
    RHS2: {
      address: '0xD3607915d934576EcdC389E7DBc641097fd5A0dE',
      decimals: 18,
    },
    EMO: {
      address: '0x181C262b973B22C307C646a67f64B76410D19b6B',
      decimals: 18,
    },
    USDC: {
      address: '0x51e44FfaD5C2B122C8b635671FCC8139dc636E82',
      decimals: 6,
    },
    USDT: {
      address: '0x7FF4a56B32ee13D7D4D405887E0eA37d61Ed919e',
      decimals: 6,
    },
    DAI: {
      address: '0x63743ACF2c7cfee65A5E356A4C4A005b586fC7AA',
      decimals: 18,
    },
    WBTC: {
      address: '0xF80699Dc594e00aE7bA200c7533a07C1604A106D',
      decimals: 8,
    },
    WETH: {
      address: '0x5842C5532b61aCF3227679a8b1BD0242a41752f2',
      decimals: 18,
    },
    EVTOMB: {
      address: '0x8F61F40615b545693dC7Ea6A6836146aCD8e42e9',
      decimals: 18,
    },
    EVSHARE: {
      address: '0x6957b60244954be36BbcF05EC17F0Fe47A228aa9',
      decimals: 18,
    },
    EDOGE: {
      address: '0x046cb616d7a52173e4Da9efF1BFd590550aa3228',
      decimals: 18,
    },
    GRDN: {
      address: '0x0A88F465eA5079C39d88EA796A018604E2C00d56',
      decimals: 18,
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
