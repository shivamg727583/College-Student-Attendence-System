import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherById, updateTeacherByAdmin } from "../../../redux/TeacherSlice";
import { fetchClasses, fetchSubjects } from "../../../redux/adminSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";

const EditTeacher = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { classes, subjects } = useSelector((state) => state.admin);
  const { selectedTeacher } = useSelector((state) => state.teacher);
  const navigate = useNavigate();

  
    // Extract unique sections and semesters
    const sections = [...new Set(classes.map((cls) => cls.section))].sort();
    const semesters = [...new Set(classes.map((cls) => cls.semester))].sort();
    const classNames = [...new Set(classes.map((cls) => cls.class_name))].sort();
  
  useEffect(() => {
    dispatch(fetchTeacherById(id));
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch, id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset, // Using reset() to properly set form values
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      teachingSchedule: [{ subjectId: "", class_name: "", section: "", semester: "" }],
    },
  });

  useEffect(() => {
    if (selectedTeacher) {
      reset(selectedTeacher); // Ensure form gets updated after fetching teacher data
    }
  }, [selectedTeacher, reset]);

  const { fields, append } = useFieldArray({ control, name: "teachingSchedule" });

  // const onSubmit = (UpdatedData) => {
  //   console.log("Submitting Data:", UpdatedData);
  //   dispatch(updateTeacherByAdmin( {id, UpdatedData }));
  //   navigate("/admin/manage-teachers");
  // };

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`teachers/edit-teacher/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Backend Response:", response);
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  console.log("Selected Teacher:", selectedTeacher);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg md:max-w-2xl bg-white p-6 sm:p-8 md:p-10 border border-gray-200 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">Update Teacher</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input {...register("name", { required: "Name is required" })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Full Name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register("email", { required: "Email is required" })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Email address" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-700">Teaching Schedule</h3>
            {fields.map((schedule, index) => (
              <div key={schedule.id} className="grid grid-cols-1 bg-gray-50 p-2 sm:grid-cols-2 gap-4">
                <select {...register(`teachingSchedule.${index}.subject_name`)} className="w-full bg-gray-100 border rounded-lg p-1">
                  <option value="" disabled>Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id} selected={schedule.subjectId === subject._id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
                <select
                  {...register(`teachingSchedule.${index}.class_name`, { required: "Class is required" })}
                  className="w-full bg-gray-100 border rounded-lg p-1"
                >
                  <option value="" disabled>Select Class</option>
                  {classNames.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>

                {/* Section Selection */}
                <select
                  {...register(`teachingSchedule.${index}.section`, { required: "Section is required" })}
                  className="w-full bg-gray-100 border rounded-lg p-1"
                >
                  <option value="" disabled>Select Section</option>
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>

                {/* Semester Selection */}
                <select
                  {...register(`teachingSchedule.${index}.semester`, { required: "Semester is required" })}
                  className="w-full bg-gray-100 border rounded-lg p-1"
                >
                  <option value="" disabled>Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={() => append({ subjectId: "", class_name: "", section: "", semester: "" })} className="mt-4 w-full py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
              Add Another Teaching Schedule
            </button>
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditTeacher;
