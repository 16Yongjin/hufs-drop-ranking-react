import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  ArrowLeftIcon,
  Card,
  Heading,
  IconButton,
  Link,
  Table,
  TextInput,
} from 'evergreen-ui'
import { useHistory, useParams } from 'react-router'
import debounce from 'lodash.debounce'
import { useStore } from '../store'
import Navbar from '../components/StickyNavbar'

const MiniTable = ({ lectures }) => {
  const history = useHistory()

  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell flexBasis={50} flexShrink={0} flexGrow={0}>
          순번
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>강의명</Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={80} flexShrink={0} flexGrow={0}>
          교수명
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0}>
          탈출
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height="100%">
        {lectures.map((lecture, idx) => (
          <Table.Row key={lecture.id}>
            <Table.TextCell isNumber flexBasis={50} flexShrink={0} flexGrow={0}>
              {idx + 1}
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

const SearchStyles = styled.div`
  background: #eee;
`

function Search() {
  const { query } = useParams()
  const history = useHistory()
  const [myQuery, setQuery] = useState(query)
  const search = useCallback(
    debounce((query) => history.replace(`/search/${query}`), 500),
    []
  )

  console.log(query)

  useEffect(() => {
    search(myQuery)
    return () => search.cancel()
  }, [search, myQuery])

  const lectureList = useStore((state) => state.lectures)

  // 강의명, 교수명 검색
  const lectureByQuery = useMemo(() => {
    if (!query || query.length < 1) return []

    return lectureList
      .filter((l) => l.name.includes(query) || l.professor.includes(query))
      .slice(0, 100)
  }, [lectureList, query])

  // 시작 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <SearchStyles>
      <Navbar>
        <IconButton
          appearance="minimal"
          icon={ArrowLeftIcon}
          iconSize={18}
          onClick={() => {
            history.goBack()
          }}
        />
        <TextInput
          value={myQuery}
          onChange={(e) => setQuery(e.target.value)}
          name="text-input-name"
          placeholder="Text input placeholder..."
          marginLeft={16}
        />
      </Navbar>
      <Card
        elevation={1}
        background="white"
        padding={16}
        paddingBottom={8}
        paddingTop={64}
        marginBottom={8}
        height="calc(100vh)"
        overflowY="auto"
      >
        <Heading fontWeight={600} size={800} marginBottom={16}>
          {myQuery} 검색 목록
        </Heading>
        <MiniTable lectures={lectureByQuery} />
      </Card>
    </SearchStyles>
  )
}

export default Search
