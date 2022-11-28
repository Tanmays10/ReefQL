// import { FaTrash } from 'react-icons/fa'

export default function ClientRow({ mission }) {
  return (
    <tr>
        <td>{mission.name}</td>
        <td>{mission.website}</td>
        <td>
            <button className="btn btn-danger btn-sm">
                {/* <FaTrash/> */}
            </button>
        </td>
    </tr>
  )
}
