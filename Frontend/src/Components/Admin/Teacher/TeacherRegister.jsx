import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerTeacher } from "../../../redux/TeacherSlice";
import { fetchAdminDashboard, fetchClasses, fetchSubjects } from "../../../redux/adminSlice";

const TeacherRegistration = () => {
  const dispatch = useDispatch();
  const { classes,  subjects } = useSelector((state) => state.admin);

  // Extract unique sections and semesters
  const sections = [...new Set(classes.map((cls) => cls.section))];
  const semesters = [...new Set(classes.map((cls) => cls.semester))];
  const classNames = [...new Set(classes.map((cls) => cls.class_name))];


  console.log({
    "sections":sections,
    "sem ":semesters,
    "name":classNames
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      teachingSchedule: [{ subjectId: "", class_name: "", section: "", semester: "" }],
    },
  });

  const { fields, append } = useFieldArray({ control, name: "teachingSchedule" });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(registerTeacher(data));
  };

  useEffect(()=>{
    // dispatch(fetchAdminDashboard);
    dispatch(fetchClasses);
    dispatch(fetchSubjects);
    
  },[dispatch])

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg md:max-w-2xl bg-white p-6 sm:p-8 md:p-10 border border-gray-200 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Register as a Teacher
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a href="/api/teachers/login" className="text-blue-600 hover:text-blue-500">
              login to your account
            </a>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Invalid email format" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              type="password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Teaching Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-700">Teaching Schedule</h3>
            {fields.map((schedule, index) => (
              <div key={schedule.id} className="grid grid-cols-1 bg-gray-50 p-2 sm:grid-cols-2 gap-4">
                {/* Subject Selection */}
                <select
                  {...register(`teachingSchedule.${index}.subjectId`, { required: "Subject is required" })}
                  className="w-full bg-gray-100 border rounded-lg p-1"
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>

                {/* Class Name Selection */}
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

            {/* Add More Teaching Schedule */}
            <button
              type="button"
              onClick={() => append({ subjectId: "", class_name: "", section: "", semester: "" })}
              className="mt-4 w-full py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
            >
              Add Another Teaching Schedule
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistration;
