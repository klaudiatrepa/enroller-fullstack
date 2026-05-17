import { useState, useEffect } from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({ username }) {
  const [meetings, setMeetings] = useState([]);
  const [addingNewMeeting, setAddingNewMeeting] = useState(false);

  async function fetchMeetings() {
    const response = await fetch(`/api/meetings`);
    if (response.ok) {
      const meetings = await response.json();
      setMeetings(meetings);
    }
  }

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function handleNewMeeting(meeting) {
    const response = await fetch("/api/meetings", {
      method: "POST",
      body: JSON.stringify(meeting),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      await fetchMeetings();
      setAddingNewMeeting(false);
    }
  }

  async function handleDeleteMeeting(meeting) {
    const response = await fetch(`/api/meetings/${meeting.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const nextMeetings = meetings.filter((m) => m !== meeting);
      setMeetings(nextMeetings);
    }
  }

  async function handleEnroll(meeting) {
    await fetch("/api/participants", {
      method: "POST",
      body: JSON.stringify({ login: username }),
      headers: { "Content-Type": "application/json" },
    });
    const updatedMeeting = {
      ...meeting,
      participants: [...meeting.participants, { login: username }],
    };
    const response = await fetch(`/api/meetings/${meeting.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedMeeting),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      await fetchMeetings();
    }
  }

  async function handleUnenroll(meeting) {
    const response = await fetch(`/api/meetings/${meeting.id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...meeting,
        participants: meeting.participants.filter((p) => p.login !== username),
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      await fetchMeetings();
    }
  }

  return (
    <div>
      <h2>Zajęcia ({meetings.length})</h2>
      {addingNewMeeting ? (
        <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)} />
      ) : (
        <button onClick={() => setAddingNewMeeting(true)}>
          Dodaj nowe spotkanie
        </button>
      )}
      {meetings.length > 0 && (
        <MeetingsList
          meetings={meetings}
          username={username}
          onDelete={handleDeleteMeeting}
          onEnroll={handleEnroll}
          onUnenroll={handleUnenroll}
        />
      )}
    </div>
  );
}
