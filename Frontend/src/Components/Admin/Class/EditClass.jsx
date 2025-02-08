import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects } from '../../../redux/adminSlice';
import { fetchTeachers } from '../../../redux/TeacherSlice';
import { updateClass } from '../../../redux/Slices/classSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function EditClass() {
  const dispatch = useDispatch();
  const { classId } = useParams();
  const { teachers, subjects: availableSubjects, classes } = useSelector((state) => state.admin);
  
  const [class_name, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [subjects, setSubjectsState] = useState([{ subject: '', teacher: '' }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    const classDetails = classes.find((cls) => cls._id === classId);
    console.log("CLASS DETAILS : ",classDetails)
    if (classDetails) {
      setClassName(classDetails.class_name);
      setSemester(classDetails.semester);
      setSection(classDetails.section);
      setSubjectsState(classDetails.subjects || [{ subject: '', teacher: '' }]);
    }
  }, [classId, classes]);

  const handleSubjectChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index][event.target.name] = event.target.value;
    setSubjectsState(newSubjects);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjectsState(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjectsState([...subjects, { subject: '', teacher: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { classId, class_name, semester, section, subjects };
    dispatch(updateClass({id:classId , updatedData:formData}));
    toast.success("Class updated successfully");
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Class</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="class_name" className="block text-gray-700 font-medium mb-2">Class Name<span className="text-red-500">*</span></label>
          <input type="text" id="class_name" name="class_name" value={class_name} onChange={(e) => setClassName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring" required />
        </div>
        <div>
          <label htmlFor="section" className="block text-gray-700 font-medium mb-2">Section<span className="text-red-500">*</span></label>
          <input type="text" id="section" name="section" value={section} onChange={(e) => setSection(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring" required />
        </div>
        <div>
          <label htmlFor="semester" className="block text-gray-700 font-medium mb-2">Semester<span className="text-red-500">*</span></label>
          <input type="text" id="semester" name="semester" value={semester} onChange={(e) => setSemester(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring" required />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Subjects<span className="text-red-500">*</span></label>
          {subjects.map((subject, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <select name="subject" value={subject.subject} onChange={(e) => handleSubjectChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring" required>
                  <option value="">Select Subject</option>
                  {availableSubjects.map((subj) => (
                    <option key={subj._id} value={subj._id}>{subj.subject_name} {subj.subject_code}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <select name="teacher" value={subject.teacher} onChange={(e) => handleSubjectChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring">
                  <option value="">Select Teacher</option>
                  {teachers.map((teach) => (
                    <option key={teach._id} value={teach._id}>{teach.name}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={() => handleRemoveSubject(index)} className="self-end bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubject} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add Another Subject</button>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Class</button>
        </div>
      </form>
    </div>
  );
}

export default EditClass;