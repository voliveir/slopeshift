import React, { useEffect, useState } from 'react'

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Lesson
        </button>
        {/* TODO: Implement create lesson modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Group</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{lesson.title}</td>
                <td className="p-3">{lesson.instructor?.staff?.name || '-'}</td>
                <td className="p-3">{lesson.group?.name || '-'}</td>
                <td className="p-3">{lesson.start ? new Date(lesson.start).toLocaleString() : '-'}</td>
                <td className="p-3">{lesson.end ? new Date(lesson.end).toLocaleString() : '-'}</td>
                <td className="p-3">
                  {/* TODO: Edit/Delete actions */}
                  <button className="text-primary-alpine font-semibold" disabled>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 