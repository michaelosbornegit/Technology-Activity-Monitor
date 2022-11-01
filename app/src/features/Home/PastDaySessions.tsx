import type { DisplaySession } from "@serverTypes/session";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPastDaySessions } from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc)

const PastDaySessions = (): JSX.Element => {
    const [session, setSession] = useState<DisplaySession>();

    useEffect(() => {
        getPastDaySessions().then((session) => {
            setSession(session);
        });
    }, []);

    console.log(session);


    return (
        <>
            {session && (
                <ResponsiveContainer width={"100%"} height={'100%'}>
                    <LineChart data={session.applicationTimeAndEndDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey='endCollectionDate'
                            tickFormatter={(utc) => dayjs.utc(utc).local().format('HH:mm')} />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {session.applicationNames.map((application) => {
                            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                            return (<Line key={application} type="monotone" dataKey={application} stroke={randomColor} />)
                        }
                        )
                        }
                    </LineChart>
                </ResponsiveContainer>
            )}
        </>
    );
}

export default PastDaySessions;