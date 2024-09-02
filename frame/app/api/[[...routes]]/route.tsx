/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { pinata } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { getDisplayName } from 'next/dist/shared/lib/utils'
import { mockArtistList } from '@/app/utils/mockData'
import { abi } from './abi.js'
import { mock } from 'node:test'
import { Address } from 'viem'

const app = new Frog({
  // browserLocation: '/',
  assetsPath: '/',
  basePath: '/api',
  title: 'ArtistQuiz',
  hub: pinata(),
}).use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  }),
)

const findArtist = (name: string) => {
  console.log(name)
  return mockArtistList.artists.find((artist) => artist.name.toLocaleLowerCase() === name.toLowerCase())
};

const getRandomQuestion = (max: number) => {
  const randomIndex = Math.floor(Math.random()*(max));
  return randomIndex;
};

app.frame('/', (c) => {
  const { inputText, status } = c
  const buttonValue = c.buttonValue
  const started = buttonValue

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Let's start?
        </div>
      </div>
    ),
    intents: [
      <Button
       action="/like"
       value="yes"
      >
        Yes
      </Button>,
    ],
  })
})

app.frame('/like', (c) => {
  const { inputText, status } = c
  const artist = inputText

  // const { displayName, followerCount, pfpUrl } = c.var.interactor || {}

  // console.log('diplayName', displayName)
  // console.log('followerCount', followerCount)
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
           {status === 'response'   
            ? `Choose your favourite artist?` 
            : ''} 
        </div>
      </div>
    ),
    action:'/artist',
    intents: [
      <TextInput //if we dont have the input artist on our site, move for an error frame
      placeholder="Enter your favourite artist"></TextInput>,
      <Button action='/artist'>Submit</Button>,
    ],
  })
})

app.frame('/artist', (c) => {
  const { inputText } = c

  //const artistData = findArtist{artist} || mockArtistList.artists[0]
  const artistData = findArtist(inputText as string)
  if (artistData == undefined || artistData == null) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Artist not found
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Reset</Button.Reset>,
      ],
    })
  }else{
    return c.res({
    image: (
      <div
      style={{
        alignItems: 'center',
        background: 'black',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
          >
          Let's start the quiz!
        </div>
      </div>
    ),
    intents: [
      <Button action="/question" value={artistData.name}>Start</Button>
    ]
  })
  }
})

app.frame('/question', (c) => {
  const { buttonValue } = c
  const name = buttonValue
  let artistData = findArtist(name as string)
  if (!artistData) {
    artistData = mockArtistList.artists[0]
  }
  const randomType = getRandomQuestion(2)
  if (randomType == 0) {
    const randomQuestion = getRandomQuestion(artistData.textQuestions.length)
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {artistData.textQuestions[randomQuestion].text}
          </div>
        </div>
      ),
      intents: [
        <TextInput placeholder="Enter your answer"></TextInput>,
        <Button action="/textAnswer" value={artistData.textQuestions[randomQuestion].correctAnswer}>Submit</Button>
      ]
    })
  }
    const randomQuestion = getRandomQuestion(artistData.choiceQuestions.length)
    const buttons = [];
    for (const option of artistData.choiceQuestions[randomQuestion].options) {
      if (option.id === artistData.choiceQuestions[randomQuestion].correctOptionId) {
        buttons.push(
          <Button action="/choiceAnswer" value="correct">{option.text}</Button>
        );
      } else {
        buttons.push(
          <Button action="/choiceAnswer" value="incorrect">{option.text}</Button>
        );
      }
    }
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {artistData.choiceQuestions[randomQuestion].text}
          </div>
        </div>
      ),
      intents: [
        ...buttons
      ]
    })
})

app.frame('/textAnswer', (c) => {
  const { buttonValue, inputText } = c;
  const correctAnswer = buttonValue;
  const answer = inputText;
  const address = c.frameData?.address;
  if (answer === correctAnswer) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Correct! Claim your NFT above!
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target={`/scored/${address}/1`}>Submit</Button.Transaction>,
        <Button>Claim</Button>
      ]
    });
  }
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Incorrect! Try again next time!
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target={`/scored/${address}/0`}>Submit</Button.Transaction>
    ]
  });
});

app.frame('/choiceAnswer', (c) => {
  const { buttonValue, frameData } = c;
  const address = c.frameData?.address;
  if (buttonValue === 'correct') {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Correct! Claim your NFT above!
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target={'/scored/${address}/1'}>Submit</Button.Transaction>,
        <Button>Claim</Button>
      ]
    });
  }
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Incorrect! Try again next time!
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target={'/not_scored/${address}/0'}>Submit</Button.Transaction>
    ]
  });
});

// app.frame('/neynar', (c) => {
// const { displayName, followerCount, pfpUrl } = c.var.interactor || {} 
// console.log('cast: ', c.var.cast)
// console.log('interactor: ', c.var.interactor)
// return c.res({
// image: (
// <div
// style={{
//   alignItems: 'center',
//   color: 'black',
//   display: 'flex',
//   justifyContent: 'center',
//   fontSize: 48,
//   height: '100%',
//   width: '100%',
// }}
// >
// Greetings {displayName}, you have {followerCount} followers.
// {/* <img
//  style={{
//   width: 200,
//   height: 200,
//  }}
//  src={pfpUrl}
//  /> */}
// </div>
// ),
// })
// })

// app.frame('/no', (c) => {
//   return c.res({
//     image: (
//       <div style={{color: 'black', display: 'flex', fontSize:60 }}>
//         perform a transaction
//       </div>
//     ),
//     intents: [
//       <TextInput placeholder="Value (ETH)" />,
//       <Button.Transaction target='Value'>Mint</Button.Transaction>,
//     ]
//   })
// })

// app.transaction('/send-ether', (c) => {
//   const { address } = c
//   const { initialPath } = c
//   const { inputText } = c
//   return c.send({/* */})
// })

app.transaction(
  '/scored/:address/:value',
  (c) => {
    const value = Number(c.req.param('value'))
    const address = c.req.param('address') as `0x${string}`;
    return c.contract({
      abi,
      //chainId: 'eip155:11155111',
      chainId: 'eip155:11155111',
      functionName: 'addAnswer',
      to: '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e',
      args: [address, value],
    })
  }
) 

// app.transaction(
//   '/not_scored',
//   (c) => {
//     const address = c.address as Address
//     return c.contract({
//       abi,
//       chainId: 'eip155:31337',
//       functionName: 'addAnswer',
//       to: '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e',
//       args = [address, 0],
//     })
//   }
// ) 

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
