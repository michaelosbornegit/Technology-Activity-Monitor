import type { DisplaySession } from "@serverTypes/session";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPastDaySessions } from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Slider, Typography } from "@mui/material";
import { HostMachines } from "@serverTypes/enums";
import styled from "@emotion/styled";
dayjs.extend(utc)

const TitleGrid = styled.div({
    display: 'flex',
    margin: 'auto',
    width: '100%',
    marginBottom: '20px',
    alignItems: 'center'
})

const TitleGridLeft = styled.div({
    display: 'flex',
    justifyContent: 'flex-start'
})

const TitleGridRight = styled.div({
    flexGrow: 1,
})

const TitleGridRightContent = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
})

const StyledSlider = styled(Slider)({
    margin: '0 20px',
    width: '200px'
})


const PastDaySessions = ({ hostMachine }: { hostMachine: HostMachines }): JSX.Element => {
    const [session, setSession] = useState<DisplaySession>();
    const [sliderValue, setSliderValue] = useState<number[]>([-12, 0]);
    const [committedSliderValue, setCommittedSliderValue] = useState<number[]>([-12, 0]);
    const [lineColors, setLineColors] = useState<{ [id: string]: string }>({})

    useEffect(() => {
        getPastDaySessions(hostMachine, committedSliderValue[0] * -1, committedSliderValue[1] * -1).then((session) => {
            setSession(session);
        });
    }, [committedSliderValue, hostMachine]);

    useEffect(() => {
        if (session) {
            const tempLineColors: { [id: string]: string } = {};
            session.applicationNames.forEach((name) => {
                tempLineColors[name] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            });
            setLineColors(tempLineColors);
        }
    }, [session])

    const handleChangeCommitted = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        setCommittedSliderValue(newValue as number[]);
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    return (
        <>
            {session && (
                <>
                    <TitleGrid>
                        <TitleGridLeft>
                            <Typography variant="h5" >{`Activity between ${dayjs().subtract(committedSliderValue[0] * -1, 'hours').format('hh.mm A')} and ${dayjs().subtract(committedSliderValue[1] * -1, 'hours').format('hh.mm A')} on ${hostMachine}`}</Typography>

                        </TitleGridLeft>
                        <TitleGridRight>
                            <TitleGridRightContent>
                                <Typography gutterBottom>
                                    Time Adjustment
                                </Typography>
                                <StyledSlider
                                    value={sliderValue}
                                    onChange={handleChange}
                                    onChangeCommitted={handleChangeCommitted}
                                    valueLabelDisplay="auto"
                                    min={-24}
                                    max={0}
                                />
                            </TitleGridRightContent>
                        </TitleGridRight>

                    </TitleGrid>

                    <ResponsiveContainer height={'85%'}>
                        <LineChart data={session.applicationTimeAndEndDate}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey='endCollectionDate'
                                tickFormatter={(utc) => dayjs.utc(utc).local().format('hh:mm A')} />
                            <YAxis />
                            <Tooltip labelFormatter={(label) => {
                                return dayjs.utc(label).local().format('hh:mm:ss A');
                            }} />
                            <Legend />

                            {session.applicationNames.map((application) => {
                                return (<Line key={application} type="monotone" dataKey={application} stroke={lineColors && lineColors[application]} />);
                            }
                            )}
                            <Line name={'Total Time'} type="monotone" dataKey={'totalTime'} stroke={'black'} />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </>
    );
}

export default PastDaySessions;