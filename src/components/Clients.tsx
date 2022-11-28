import { gql, useQuery } from "@apollo/client"
import ClientRow from "./ClientRow";
import Spinner from "./Spinner";
import { GET_MISSIONS } from "./queries/clientQuerie";



export default function Clients() {

    const { loading, error, data } = useQuery(GET_MISSIONS)
    if (loading) return <Spinner/>
    if (error) return <p>error: {error}</p>
    console.log(data)
    return (
        <>
            {!loading && !error &&
                <table className="table table-hover mt-3">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Website</th>
                            {/* <th>manufacturers</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.missions.map(mission => {
                            return <ClientRow mission={mission}/>
                        })}
                        
                    </tbody>
                </table>
                }

                </>
    )
}
