import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import styled from 'styled-components'
import { courseMap } from '../data/courses'
import {
  ArrowLeftIcon,
  Button,
  Card,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  Heading,
  IconButton,
  Link,
  SearchIcon,
  SegmentedControl,
  Select,
  SelectMenu,
  Strong,
} from 'evergreen-ui'
import { useHistory, useParams } from 'react-router'
import { useStore } from '../store'
import { campusMap } from '../data/campus'
import Navbar from '../components/StickyNavbar'

const SelectDepartment = ({ department, setDepartment, courses }) => {
  return (
    <SelectMenu
      title="학과 선택"
      options={courses.map(([label, value]) => ({ label, value }))}
      selected={department.value}
      isMultiSelect
      onSelect={(item) => setDepartment(item)}
      onDeselect={() => setDepartment({ label: '', value: '' })}
    >
      <Button>{department.label || '학과를 선택하세요'}</Button>
    </SelectMenu>
  )
}

const TableStyles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid rgb(237, 240, 242);
  }

  .center {
    text-align: center;
  }

  .link {
    cursor: pointer;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    font-size: 0.8rem;

    thead {
      // background: rgb(245, 246, 247);
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid rgb(237, 240, 242);
    }
  }

  .pagination {
    width: calc(100% - 2rem);
    margin: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .spacer {
    flex-grow: 1;
  }

  .text-center {
    text-align: center;
  }
`

const Pagination = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
}) => {
  return (
    <div className="pagination">
      <IconButton
        icon={DoubleChevronLeftIcon}
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      />{' '}
      <IconButton
        icon={ChevronLeftIcon}
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      />{' '}
      <span className="spacer text-center">
        <Strong>
          {pageIndex + 1} / {pageOptions.length}
        </Strong>{' '}
      </span>
      <IconButton
        icon={ChevronRightIcon}
        onClick={() => nextPage()}
        disabled={!canNextPage}
      />
      <IconButton
        icon={DoubleChevronRightIcon}
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      />
      <Select
        minWidth={80}
        maxWidth={128}
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[10, 25, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}개씩
          </option>
        ))}
      </Select>
    </div>
  )
}

const Table = ({
  lectures,
  columns,
  campusType,
  department,
  setDepartment,
}) => {
  const history = useHistory()
  const pathname = history.location.pathname
  const search = window.location.search
  const params = new URLSearchParams(search)
  const prevCampusType = params.get('prevCampusType')
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: lectures,
      initialState: {
        sortBy: [{ id: 'rank', desc: false }],
        pageSize: Number(params.get('pageSize')) || 10,
        pageIndex: Number(params.get('pageIndex')),
      },
    },
    useSortBy,
    usePagination
  )

  // 학과 변경 시 테이블 1 페이지로 이동
  useEffect(() => {
    if (department.value) gotoPage(0)
  }, [department, gotoPage])

  // 학과, 테이블 페이지 변경 시 쿼리 파라미터 업데이트
  useEffect(() => {
    const params = `courseName=${department.label}&courseId=${department.value}&pageSize=${pageSize}&pageIndex=${pageIndex}&prevCampusType=${campusType}`
    history.replace(`${pathname}?${params}`)
  }, [department, pageSize, pageIndex, history, pathname, campusType])

  useEffect(() => {
    if (campusType === prevCampusType) return
    console.log('campus change')

    gotoPage(0)
    setDepartment({ label: '', value: '' })
  }, [campusType, prevCampusType, gotoPage, setDepartment])

  return (
    <TableStyles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pagination
        {...{
          gotoPage,
          canPreviousPage,
          previousPage,
          nextPage,
          canNextPage,
          pageCount,
          pageIndex,
          pageOptions,
          pageSize,
          setPageSize,
        }}
      />
    </TableStyles>
  )
}

const ListStyles = styled.div`
  background: #eee;

  .select {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }
`

function List() {
  const { campusType } = useParams()
  const history = useHistory()
  const search = window.location.search
  const params = new URLSearchParams(search)
  const prevCampusType = params.get('prevCampusType')

  const showDetail = (id) => history.push(`/detail/${id}`)
  const showSearch = (query) => history.push(`/search/${query}`)

  const [campus, setCampus] = useState(
    campusType.startsWith('seoul') ? 'seoul' : 'global'
  )
  const [course, setCourse] = useState(
    campusType.endsWith('Major') ? 'Major' : 'Minor'
  )

  const [department, setDepartment] = useState({
    label: params.get('courseName') || '',
    value: params.get('courseId') || '',
  })

  useEffect(() => {
    const campusType = campus + course
    if (prevCampusType !== campusType) history.push(`/list/${campusType}`)
  }, [campus, course, prevCampusType, history])

  const columns = useMemo(
    () => [
      {
        Header: '순위',
        accessor: 'rank',
        Cell: (row) => <div className="center">{row.value}</div>,
      },
      {
        Header: '강의명',
        accessor: 'name',
        Cell: (row) => (
          <Link
            className="link"
            onClick={() => showDetail(row.row.original.id)}
          >
            {row.value}
          </Link>
        ),
      },
      {
        Header: '교수명',
        accessor: 'professor',
        Cell: (row) => (
          <Link className="link" onClick={() => showSearch(row.value)}>
            {row.value}
          </Link>
        ),
      },
      {
        Header: '탈출',
        accessor: 'delta',
        align: 'center',
        Cell: (row) => <div className="center">{row.value}</div>,
      },
      {
        Header: '인원',
        accessor: 'people',
        align: 'center',
        Cell: (row) => <div className="center">{row.value}</div>,
      },
    ],
    []
  )

  const courses = useMemo(() => courseMap[campusType] || [], [campusType])

  const lectureList = useStore((state) => state.lectures)

  // 학과별 강의 필터링
  const lectureByCampus = useMemo(() => {
    return lectureList.filter((l) => l.t === campusMap[campusType])
  }, [lectureList, campusType])

  // 전공별 강의 필터링
  const lectures = useMemo(() => {
    if (department.value)
      return lectureByCampus.filter((l) => l.courseId === department.value)

    return lectureByCampus
  }, [lectureByCampus, department])

  return (
    <ListStyles>
      <Navbar>
        <IconButton
          appearance="minimal"
          icon={ArrowLeftIcon}
          iconSize={18}
          onClick={() => {
            history.push('/')
          }}
        />
        <Heading className="header" size={600}>
          목록
        </Heading>
        <IconButton
          appearance="minimal"
          icon={SearchIcon}
          iconSize={18}
          onClick={() => {
            history.push('/search/')
          }}
        />
      </Navbar>
      <Card
        elevation={1}
        background="white"
        paddingX={16}
        paddingBottom={8}
        paddingTop={48}
        marginBottom={8}
      >
        <div>
          <Heading fontWeight={600} size={700} marginBottom={16}>
            목록
          </Heading>
        </div>
        <div className="select">
          <Heading fontWeight={600} size={500} marginRight={16}>
            캠퍼스
          </Heading>
          <SegmentedControl
            width={200}
            options={[
              { label: '서울', value: 'seoul' },
              { label: '글로벌', value: 'global' },
            ]}
            value={campus}
            onChange={(value) => setCampus(value)}
          />
        </div>

        <div className="select">
          <Heading fontWeight={600} size={500} marginRight={32}>
            과정
          </Heading>
          <SegmentedControl
            width={200}
            options={[
              { label: '전공', value: 'Major' },
              { label: '교양', value: 'Minor' },
            ]}
            value={course}
            onChange={(value) => setCourse(value)}
          />
        </div>

        <div className="select">
          <Heading fontWeight={600} size={500} marginRight={32}>
            학과
          </Heading>
          <SelectDepartment
            courses={courses}
            department={department}
            setDepartment={setDepartment}
          />
        </div>
      </Card>
      <Card elevation={1} background="white">
        <Table
          courses={courses}
          lectures={lectures}
          columns={columns}
          campusType={campusType}
          department={department}
          setDepartment={setDepartment}
        />
      </Card>
    </ListStyles>
  )
}

export default List
