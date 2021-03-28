import { Heading, Link, Pane, Table } from 'evergreen-ui'
import React from 'react'
import { useHistory } from 'react-router'
import Navbar from '../components/StickyNavbar'
import { campusEnum, campusKo } from '../data/campus'
import lectureList from '../data/topRank.json'
import removeLectureList from '../data/removed.json'
import styled from 'styled-components'

const MiniTable = ({ lectures }) => {
  const history = useHistory()

  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0}>
          순위
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>강의명</Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={80} flexShrink={0} flexGrow={0}>
          교수명
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0}>
          탈출
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {lectures.map((lecture) => (
          <Table.Row key={lecture.id}>
            <Table.TextCell isNumber flexBasis={60} flexShrink={0} flexGrow={0}>
              {lecture.rank}
            </Table.TextCell>
            <Table.TextCell>
              <Link
                size={300}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push(`/detail/${lecture.id}`)
                }}
              >
                {lecture.name}
              </Link>
            </Table.TextCell>
            <Table.TextCell flexBasis={80} flexShrink={0} flexGrow={0}>
              {lecture.professor}
            </Table.TextCell>
            <Table.TextCell flexBasis={60} flexShrink={0} flexGrow={0}>
              {lecture.delta}
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
const MiniTable2 = ({ lectures }) => {
  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>
          번호
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>강의명</Table.TextHeaderCell>
        <Table.TextHeaderCell>교수명</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {lectures.map((lecture, idx) => (
          <Table.Row key={lecture.id}>
            <Table.TextCell isNumber flexBasis={50} flexShrink={0} flexGrow={0}>
              {idx + 1}
            </Table.TextCell>
            <Table.TextCell>{lecture.name}</Table.TextCell>
            <Table.TextCell>{lecture.professor}</Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

const Styles = styled.div`
  .grid {
    display: grid;
    // grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  @media (min-width: 1000px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`

const Home = () => {
  const history = useHistory()

  return (
    <Styles>
      <Navbar>
        <Heading className="header" size={600}>
          한국외대 21-1 Drop 랭킹
        </Heading>
      </Navbar>

      <Pane
        elevation={1}
        paddingX={16}
        paddingY={48}
        marginBottom={16}
        background="white"
      >
        <Heading size={800} fontWeight={600}>
          한국외대 21-1 Drop 랭킹
        </Heading>
      </Pane>

      <div className="grid">
        {campusKo.map((campus, idx) => (
          <Pane
            key={campus}
            marginBottom={32}
            paddingY={16}
            background="white"
            elevation={1}
            maxWidth="100vw"
          >
            <Heading size={700} fontWeight={600} padding={16}>
              {campus} TOP 20
            </Heading>
            <Pane margin={16} elevation={1}>
              <MiniTable lectures={lectureList[idx]} />
            </Pane>
            <Pane
              display="flex"
              justifyContent="flex-end"
              paddingRight={16}
              width="100%"
            >
              <Link onClick={() => history.push(`/list/${campusEnum[idx]}`)}>
                더 알아보기 {'>>'}
              </Link>
            </Pane>
          </Pane>
        ))}
      </div>

      <Pane>
        <Heading size={700} fontWeight={600} padding={16} background="white">
          ⚰️ 사라진 강의
        </Heading>
      </Pane>
      <div className="grid">
        {['설캠', '글캠'].map((campus, idx) => (
          <Pane key={campus} background="white" elevation={1} paddingY={16}>
            <Heading size={700} fontWeight={600} padding={16}>
              {campus} 사라진 강의
            </Heading>
            <Pane margin={16} elevation={1}>
              <MiniTable2 lectures={removeLectureList[idx]} />
            </Pane>
          </Pane>
        ))}
      </div>
    </Styles>
  )
}

export default Home
