import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import NftItem from '../../components/NftItem'
import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { Flex } from 'rebass'

const PageWrapper = styled(AutoColumn)`
  //max-width: 640px;
  width: 95%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Home() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })
  const myData: any = [
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Michael Jordan by Michael Jordan',
        createdBy: 'Michael Jordan',
        yearCreated: '2021',
        description:
          'Michael Jordan, the American Basketball Player by Michael Jordan, the South African Crypto Artist. When I tell people my name is Michael Jordan, I always get strange reactions, during lockdown, ESPN interviewed me and another 15 people who share the name with the Legendary Basketball Player. I\'m also a big fan of Pokemon and wanted to add my own flavour of "Michael Jordan Personality" to this piece. The fact that I\'m minting this a day after the Pokemon 25th Anniversary is just a bonus and adds to the celebration.',
        image: 'https://ipfs.pixura.io/ipfs/QmQufjVuQQ57fWVDRzX2BCg1xosKXEg2vbz2d8ygy2uHJp/ezgif.com-gif-maker34.gif',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmQufjVuQQ57fWVDRzX2BCg1xosKXEg2vbz2d8ygy2uHJp/ezgif.com-gif-maker34.gif',
          dimensions: '600x600',
          size: '46589879',
          mimeType: 'image/gif'
        },
        tags: ['MichaelJordan']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Hidden Treasure',
        createdBy: 'Michael Jordan',
        yearCreated: '2021',
        description:
          'Bitcoin is like treasure hidden in a field. When a man found it, he hid it again, and then in his joy went and sold all he had and bought that field. Matthew 13:44 ',
        image: 'https://ipfs.pixura.io/ipfs/Qme2c9mUYT4adqX7GubcJiRxUByAfMNfjUUxB7qzPNY6iX/ezgif.com-gif-maker44.gif',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/Qme2c9mUYT4adqX7GubcJiRxUByAfMNfjUUxB7qzPNY6iX/ezgif.com-gif-maker44.gif',
          dimensions: '800x800',
          size: '1787592',
          mimeType: 'image/gif'
        },
        tags: ['Rembrandt']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Blue Girl',
        createdBy: 'Michael Jordan',
        yearCreated: '2021',
        description:
          'The dark blue background variant of Green Girl. Additional faces have been added to the bottom corners for balance and all the colours have been darkened. The white background variant first had my signature in the bottom right corner for balance, but with blockchain technology, there is no need for a visual signature and so it was removed. I explored other colour backgrounds, most notably green, black and red but none of them felt right. So this will be the final variant of Green Girl.',
        image: 'https://ipfs.pixura.io/ipfs/QmfKJadrWGRNH5mA5H6fnV6sGQrwN7uyJKQCPhxhWBg9KJ/biggonegirlDarkEdition.png',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmfKJadrWGRNH5mA5H6fnV6sGQrwN7uyJKQCPhxhWBg9KJ/biggonegirlDarkEdition.png',
          dimensions: '15749x15749',
          size: '48432276',
          mimeType: 'image/png'
        },
        tags: ['variant']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Zagato',
        createdBy: 'Michael Jordan',
        yearCreated: '2021',
        description:
          "I remember the day my dad brought home a 1972 Alfa Romeo JZ 1600 designed by Zagato. The wedge-shaped body and large, glazed tailgate were at first not to my taste. My dad was very brave to let me drive his new collector's piece while I only had a learner's license. I grew to love the car and was almost as sad as my dad on the day he sold it.",
        image: 'https://ipfs.pixura.io/ipfs/QmXUgCY4VFLFh7UWMaScUSqzfoVaE6wBLCqdnLHBy7J2Ce/Zagato.png',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmXUgCY4VFLFh7UWMaScUSqzfoVaE6wBLCqdnLHBy7J2Ce/Zagato.png',
          dimensions: '3544x3544',
          size: '287585',
          mimeType: 'image/png'
        },
        tags: ['Car', '70s']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Bubble Llama',
        createdBy: 'Michael Jordan',
        yearCreated: '2021',
        description:
          "Hi I'm Pecan-nut the Llama, check out my friends and I on Instragram: https://www.instagram.com/dollyllamasquad",
        image: 'https://ipfs.pixura.io/ipfs/QmV8com1YjbuWR9XGVkCWePa5cKKyj7VukB7pn9t8exwbh/ezgif.com-gif-maker42.gif',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmV8com1YjbuWR9XGVkCWePa5cKKyj7VukB7pn9t8exwbh/ezgif.com-gif-maker42.gif',
          dimensions: '1200x1200',
          size: '5258684',
          mimeType: 'image/gif'
        },
        tags: ['llama', 'cute']
      }
    }
  ]

  const MarketPlaceContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    padding: 0 1%;
    @media screen and (min-width: 1600px) {
      padding: 0 4%;
    }
  `

  return (
    <>
      <MarketPlaceContainer>
        <NftItem item={JSON.stringify(myData[0])} />
        <NftItem item={JSON.stringify(myData[1])} />
        <NftItem item={JSON.stringify(myData[2])} />
        <NftItem item={JSON.stringify(myData[3])} />
        <NftItem item={JSON.stringify(myData[4])} />
      </MarketPlaceContainer>
      {/* <PageWrapper> <NftItem>Mike</NftItem>
        <NftItem>Tyson</NftItem> */}
      {/* <VoteCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Liquidity provider rewards</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
                </TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                target="_blank"
                href="https://uniswap.org/docs/v2/core-concepts/pools/"
              >
                <TYPE.white fontSize={14}>Read more about providing liquidity</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your liquidity
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/ETH">
                  Create a pair
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/ETH">
                  <Text fontWeight={500} fontSize={16}>
                    Add Liquidity
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
              <>
                <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://uniswap.info/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary>
                {v2PairsWithoutStakedAmount.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
                {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <FullPositionCard
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    )
                )}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}

            <AutoColumn justify={'center'} gap="md">
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
                <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? 'Migrate now.' : 'Import it.'}
                </StyledInternalLink>
              </Text>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn> </PageWrapper>*/}
    </>
  )
}
