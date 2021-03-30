import React, { useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from 'recharts'
import { useStore } from '../store'
import styled from 'styled-components'
import { Pane, Card, Heading } from 'evergreen-ui'
import { campusCounts } from '../data/campus'
import { courseNames } from '../data/courses'
import Navbar from '../components/BackNavbar'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const Styles = styled.div`
  /* This is required to make the table full-width */
  max-width: 100%;
  background: #eee;

  .header {
    padding: 2rem;
  }

  .block {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin-right: 1rem;
  }

  .info {
    display: flex;
    margin: 0 2rem 1rem 2rem;
  }

  .link {
    color: rgb(52, 156, 239);
    text-decoration: underline;
    cursor: pointer;
  }
`

const Detail = () => {
  const history = useHistory()
  const { id } = useParams()
  const lectures = useStore((state) => state.lectures)
  const lecture = useMemo(() => lectures.find((l) => l.id === id), [
    id,
    lectures,
  ])
  const countData = useMemo(() => {
    if (!lecture) return []
    const days = ['22 월', '23 화', '24 수', '25 목', '26 금', '29 월']

    const countData = lecture.trend.map((n, idx) => ({
      day: days[idx],
      people: n,
    }))

    return countData
  }, [lecture])

  const deltaData = useMemo(() => {
    if (!lecture) return []
    const days = ['23 화', '24 수', '25 목', '26 금', '29 월']

    const deltas = lecture.trend
      .slice(1)
      .reduce((acc, v, idx) => [...acc, lecture.trend[idx] - v], [])

    const deltaData = deltas.map((n, idx) => ({
      day: days[idx],
      drop: n,
    }))

    return deltaData
  }, [lecture])

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    if (value === 0) return ''

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} ${value}명`}
      </text>
    )
  }

  // 시작 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!lecture) {
    return <div>detail {id}</div>
  }

  return (
    <Styles>
      <Navbar title={lecture.name} />
      <Card
        elevation={1}
        background="white"
        marginBottom={16}
        paddingTop={16}
        paddingBottom={8}
      >
        <div className="header">
          <Heading size={800} fontWeight={600} marginTop={8}>
            {lecture.name}
          </Heading>
          <Heading size={700} fontWeight={600} marginTop={8}>
            {courseNames[lecture.courseId]}
          </Heading>
          <Heading size={700} fontWeight={600} marginTop={8}>
            <span
              className="link"
              onClick={() => history.push(`/search/${lecture.professor}`)}
            >
              {lecture.professor}
            </span>{' '}
            / {lecture.time}
          </Heading>
          <Heading size={600} fontWeight={600} marginTop={8} color="#0088FE">
            {lecture.delta}명 탈출
          </Heading>
          <Heading marginTop={8}>
            순위: {lecture.rank}등 / {campusCounts[lecture.t]}개
          </Heading>
        </div>
        <ResponsiveContainer width="98%" height={300}>
          <LineChart
            width={370}
            height={300}
            data={countData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="people" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card
        elevation={1}
        background="white"
        paddingBottom={8}
        marginBottom={16}
      >
        <div className="header">
          <Heading fontWeight={600} size={800} marginBottom={8}>
            탈출 추이
          </Heading>
        </div>

        <ResponsiveContainer width="98%" height={350}>
          <BarChart data={deltaData} margin={{ right: 32 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="drop" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card elevation={1} background="white" paddingBottom={8}>
        <div className="header">
          <Heading fontWeight={600} size={800} marginBottom={8}>
            등록현황
          </Heading>
          <Heading fontWeight={600} size={600} marginLeft={3}>
            {lecture.people}
          </Heading>
        </div>

        <ResponsiveContainer width="98%" height={350}>
          <PieChart width={370} height={350}>
            <Pie
              data={[
                { name: '등록', value: lecture.count },
                { name: '취소', value: lecture.delta },
                {
                  name: '미등록',
                  value: lecture.total - lecture.count - lecture.delta,
                },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {countData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <Pane className="info">
          <span className="block" style={{ background: COLORS[0] }}></span>
          <Heading fontWeight={600} size={500}>
            등록비율: {Math.round((lecture.count / lecture.total) * 100)}%
          </Heading>
        </Pane>
        <Pane className="info">
          <span className="block" style={{ background: COLORS[1] }}></span>
          <Heading fontWeight={600} size={500}>
            탈주비율: {Math.round((lecture.delta / lecture.total) * 100)}%
          </Heading>
        </Pane>
        <Pane className="info">
          <span className="block" style={{ background: COLORS[2] }}></span>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Heading fontWeight={600} size={500} width="100%">
              미등록 비율:{' '}
              {Math.round(
                ((lecture.total - lecture.count - lecture.delta) /
                  lecture.total) *
                  100
              )}
              %
            </Heading>
          </div>
        </Pane>
      </Card>
    </Styles>
  )
}

export default Detail
