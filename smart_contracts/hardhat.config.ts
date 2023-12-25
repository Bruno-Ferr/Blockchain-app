import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/xze4uYqHEgYuCq_znyELGwR4Og0UwOYk',
      accounts: ['a1886659d93d0bfd5899dd1bbd66ebc55fb305422e0b830e83ba353ca566bf0e']
    }
  }
};

export default config;
