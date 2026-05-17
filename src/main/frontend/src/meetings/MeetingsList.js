export default function MeetingsList({
  meetings,
  onDelete,
  username,
  onEnroll,
  onUnenroll,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nazwa spotkania</th>
          <th>Opis</th>
          <th>Uczestnicy</th>
          <th>Akcja</th>
        </tr>
      </thead>

      <tbody>
        {meetings.map((meeting, index) => {
          const isEnrolled = meeting.participants.some(
            (p) => p.login === username,
          );
          return (
            <tr key={index}>
              <td>{meeting.title}</td>
              <td>{meeting.description}</td>
              <td>{meeting.participants.map((p) => p.login).join(", ")}</td>
              <td>
                <button
                  onClick={() =>
                    isEnrolled ? onUnenroll(meeting) : onEnroll(meeting)
                  }
                >
                  {isEnrolled ? "Wypisz się" : "Zapisz się"}
                </button>
                <button
                  disabled={meeting.participants.length > 0}
                  onClick={() => onDelete(meeting)}
                >
                  Usuń spotkanie
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
