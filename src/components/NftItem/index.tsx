import React from 'react'
import styled from 'styled-components'
import { CardProps, Text, Image, Flex, Heading } from 'rebass'
import { Box } from 'rebass/styled-components'
import Column from 'components/Column'

// const NftItem = styled(Box)<{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
//   border-radius: 16px;
//   padding: 1.25rem;
//   padding: ${({ padding }) => padding};
//   border: ${({ border }) => border};
//   border-radius: ${({ borderRadius }) => borderRadius};
// `

// const BlueCardStyled = styled(NftItem)`
//   width: ${({ width }) => width ?? '33%'};
//   background-color: ${({ theme }) => theme.primary5};
//   color: ${({ theme }) => theme.primary1};
//   border-radius: 12px;
//   width: fit-content;
// `

const dataType = {
  image: ['image/jpeg'],
  video: ['video/mp4']
}

function getMediaType(mediaType: string) {
  if (dataType.image.includes(mediaType)) {
    return 'image'
  } else if (dataType.video.includes(mediaType)) {
    return 'video'
  } else {
    return 'image'
  }
}

const Video = styled.video`
  width: 100%;
`

const Card = styled.div`
  overflow: hidden;
  //padding: 0 0 32px;
  margin: 10px;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  //flex-grow: 1;
`

const CardContainer = styled.div`
  flex-basis: 200px;
  flex-shrink: 1;
  flex-grow: 1;
`

const CardBody = styled.div`
  //background-color: pink;
`

const CardMedia = styled.div`
  //background-color: pink;
`

const CardSplit = styled.br`
  clear: both;
`

const NftItem = ({ item }: any) => {
  console.log('ss', item)
  const data = JSON.parse(item).data
  return (
    <CardContainer>
      <Card>
        <CardMedia>
          {getMediaType(data.media.mimeType) == 'video' ? (
            <Video muted loop autoPlay>
              <source src={data.media.uri} type="video/mp4" />
            </Video>
          ) : (
            ''
          )}
          {getMediaType(data.media.mimeType) == 'image' ? (
            <Image
              src={data.image}
              sx={{
                width: '100%',
                borderRadius: 8,
                height: '400px'
              }}
            />
          ) : (
            ''
          )}
        </CardMedia>
        <CardBody>
          <Flex alignItems="center">
            <Box px={2} py={2} width={3 / 4}>
              <Text
                p={1}
                fontSize={[3]}
                fontWeight="bold"
                color="background"
                bg="primary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {data.name}
              </Text>
            </Box>
            <Box px={2} py={2} width={1 / 4}>
              <Text p={1} fontSize={[1]} fontWeight="bold" color="background" bg="primary" sx={{ float: 'right' }}>
                Artist
              </Text>
              <Text p={1} fontSize={[1]} fontWeight="bold" color="background" bg="primary" sx={{ float: 'right' }}>
                Address
              </Text>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Box px={2} py={2} width={3 / 4}>
              <Text p={1} fontSize={[2]} fontWeight="bold" color="background" bg="primary">
                Eth 2.0 ($4000)
              </Text>
            </Box>

            <Box px={2} py={2} width={1 / 4}>
              <Text p={1} fontSize={[1]} fontWeight="bold" color="background" bg="primary" sx={{ float: 'right' }}>
                Owner
              </Text>

              <Text p={1} fontSize={[1]} fontWeight="bold" color="background" bg="primary" sx={{ float: 'right' }}>
                Address1
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </CardContainer>
    // <Text fontWeight={500} color="#2172E5">
    //   {data.auctionType}
    // </Text>
  )
}

export default NftItem
