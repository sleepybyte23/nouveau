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
        name: 'People Nowadays',
        createdBy: '@mehmetgeren',
        yearCreated: '2021',
        description: '"People Nowadays"\nResolution : 3000x3000px',
        image: 'https://ipfs.pixura.io/ipfs/Qmbb8eHjkDqvK5CKZkvhHm4T5QaiMTpRc4t6WLYqZAw7HN/david-face2.jpg',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/Qmbb8eHjkDqvK5CKZkvhHm4T5QaiMTpRc4t6WLYqZAw7HN/david-face2.jpg',
          dimensions: '3000x3000',
          size: '2344996',
          mimeType: 'image/jpeg'
        },
        tags: ['3d', 'sculpture', 'art', 'socialmedia', '3dart', 'surrealism', 'cgi', '3D']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'LITLE COLD HEART - IN BETWEEN DEATH AND MADNESS',
        createdBy: 'phlofy',
        yearCreated: '2021',
        description:
          '“I will always be the virgin-prostitute, the perverse angel, the two-faced sinister and saintly woman.”\n- Anais Nin\n...\nBe who the hell you want to be, just be mine',
        image:
          'https://ipfs.pixura.io/ipfs/QmWB6bB79hMeWe3uWzgQxSMdriyHv13KyPA6jGGZAsbQt2/AVATAR-LITLECOLDHEART-INBETWEENDEATHANDMADNESS.jpg',
        media: {
          uri:
            'https://ipfs.pixura.io/ipfs/QmTZtPFbwAWJbC7kT77WB5rTygjnQiN4MboxiiMKXmX5NE/LITLECOLDHEART-INBETWEENDEATHANDMADNESS.jpg',
          dimensions: '4423x6825',
          size: '25976295',
          mimeType: 'image/jpeg'
        },
        tags: ['illustration', 'phlofy', 'surreal', 'surrealism', 'floral', 'love', 'heart', 'woman', 'koi', 'abstract']
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Come Down',
        createdBy: 'Crack',
        yearCreated: '2021',
        description:
          'Come Down // Come down from what ? Substances or your existence ?\n\nFreshing some colors after raining season // 1 of 1 edition // Loopout Pingpong Series // 1500px x 1500px ',
        image: 'https://ipfs.pixura.io/ipfs/QmVHUS8avNKvsqRmRgDTzHWh4Sr149a73FqrJcCwTQZB7S/comedown.gif',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmVHUS8avNKvsqRmRgDTzHWh4Sr149a73FqrJcCwTQZB7S/comedown.gif',
          dimensions: '1500x1500',
          size: '49394816',
          mimeType: 'image/gif'
        },
        tags: [
          'crack',
          '2d',
          'graffiti',
          'cryptoart',
          'animation',
          'superrare',
          'surreal',
          'illustration',
          'animated',
          'drawing',
          'loop',
          '2dart'
        ]
      }
    },
    {
      auctionType: 'penny',
      nftLocation: 'superrare',
      data: {
        name: 'Gluttony',
        createdBy: 'FOREAL®',
        yearCreated: '2021',
        description: 'Starter, entrée and dessert on repeat.',
        image: 'https://ipfs.pixura.io/ipfs/QmTb4C9Enohr4rt3ivdu9bM6g85nTvCUWNGz98xiboVpQG/FOREAL_Gluttony_thumb.gif',
        media: {
          uri: 'https://ipfs.pixura.io/ipfs/QmNkZRWebq2cn4t7ewjCbiDSRVzCVA4Y5UrEhDMVVmAVwW/FOREAL_Gluttony.mp4',
          dimensions: '1500x1500',
          size: '29883704',
          mimeType: 'video/mp4'
        },
        tags: [
          'foreal',
          'weareforeal',
          'cgi',
          '3dart',
          'animation',
          'loop',
          'food',
          'donut',
          'face',
          'surreal',
          'animated',
          'render',
          'munchies'
        ]
      }
    }
  ]

  const MarketPlaceContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
  `

  return (
    <>
      <MarketPlaceContainer>
        <NftItem item={JSON.stringify(myData[0])} />
        <NftItem item={JSON.stringify(myData[1])} />
        <NftItem item={JSON.stringify(myData[2])} />
        <NftItem item={JSON.stringify(myData[3])} />
        <NftItem item={JSON.stringify(myData[0])} />
        <NftItem item={JSON.stringify(myData[1])} />
        <NftItem item={JSON.stringify(myData[2])} />
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
