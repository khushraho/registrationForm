import { useState, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { toast  } from 'react-toastify';

import "./form.css"
const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    residentialAddress1: '',
    residentialAddress2: '',
    sameAsResidential: false,
    permanentAddress1: '',
    permanentAddress2: '',
    files: [{ name: '', type: '', file: null }]
  });

  const fileInputRefs = useRef([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sameAsResidential") {
      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          sameAsResidential: checked,
        };
        if (checked) {
          newFormData.permanentAddress1 = prevFormData.residentialAddress1;
          newFormData.permanentAddress2 = prevFormData.residentialAddress2;
        }
        else {
          newFormData.permanentAddress1 = '';
          newFormData.permanentAddress2 = '';
        }
        return newFormData;
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newFiles = [...formData.files];
    newFiles[index].file = file;
    newFiles[index].name = file ? file.name : ''; // Automatically set file name

    // Extract file type from file name
    const fileType = file ? (file.type.startsWith('image/') ? 'image' : 'pdf') : '';

    newFiles[index].type = fileType;

    setFormData(prevFormData => ({
      ...prevFormData,
      files: newFiles,
    }));
  };


  const handleAddFile = () => {
    setFormData({
      ...formData,
      files: [...formData.files, { name: '', type: '', file: null }]
    });
  };

  const handleRemoveFile = (index) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
  };

  const handleIconClick = (index) => {
    fileInputRefs.current[index].click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const today = new Date();
    const dobDate = new Date(formData.dob);
    const ageDiff = today.getFullYear() - dobDate.getFullYear();
    const isOver18 = ageDiff > 18 || (ageDiff === 18 && today.getMonth() >= dobDate.getMonth() && today.getDate() >= dobDate.getDate());

    if (!isOver18) {
      toast.error("Date of birth must be at least 18 years ago.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'files') {
        formData.files.forEach(file => {
          data.append(`files`, file.file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:4400/api/v1/user_register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Form submitted successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          dob: '',
          residentialAddress1: '',
          residentialAddress2: '',
          sameAsResidential: false,
          permanentAddress1: '',
          permanentAddress2: '',
          files: [{ name: '', type: '', file: null }]
        });
      } else {
        toast.error(result.error || "Error submitting form.");
      }
      console.log('Form submitted successfully:', result);
    } catch (error) {
      toast.error('Error submitting form.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className=' text-3xl justify-center flex font-bold text-black mx-auto p-2 '>
        <h4>MERN STACK MACHINE TEST</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
            required 
            autoFocus
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Enter your first name here.."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
            required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Enter your last name here.."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              E-mail<span className="text-red-500">*</span>
            </label>
            <input
            required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="ex: myname@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
            />
          </div>
        </div>

        <div className="flex flex-col ">
            <label className="block text-sm font-medium mb-2">
              Residential Address
            </label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '> 
          <div className='flex flex-col '>
            <label className="mb-2 text-sm font-medium text-gray-700 ">
              Street1<span className="text-red-500">*</span>
            </label>
            <input
            required
              type="text"
              name="residentialAddress1"
              value={formData.residentialAddress1}
              onChange={handleChange}
              className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Street 1"
            />
          </div>
          <div className='flex flex-col '>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Street2<span className="text-red-500">*</span>
            </label>
            <input
            required
              type="text"
              name="residentialAddress2"
              value={formData.residentialAddress2}
              onChange={handleChange}
              className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Street 2"
            />
          </div>
        </div>
            </div>

        {/* <div className="flex items-center"> */}
        <div className={`flex items-center ${formData.sameAsResidential ? 'checked-class' : ''}`}>
          <input
            id="same-address"
            type="checkbox"
            name="sameAsResidential"
            checked={formData.sameAsResidential}
            onChange={handleChange}
            className="h-5 w-5 border-gray-700 rounded"
          />
          <label htmlFor="same-address" className="ml-2 block text-sm font-medium text-gray-700">
            Same as Residential Address
          </label>
        </div>

      

          <div className="flex flex-col ">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permanent Address
            </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='flex flex-col '>
        <label className="mb-2 text-sm font-medium text-gray-700 ">
              Street1
            </label>
            <input
            required
              type="text"
              name="permanentAddress1"
              value={formData.permanentAddress1}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Street 1"
              disabled={formData.sameAsResidential}
            />
        </div>
          <div className='flex flex-col '>
           <label className="block text-sm font-medium text-gray-700 mb-2">
              Street2
            </label>
            <input
            required
              type="text"
              name="permanentAddress2"
              value={formData.permanentAddress2} 
              onChange={handleChange}
              className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
              placeholder="Street 2"
              disabled={formData.sameAsResidential}
            />
          </div>
        </div>
        </div>

        <div className="space-y-8">
          {formData.files.map((file, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  File Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={`fileName-${index}`}
                  value={file.name}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8 pl-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 ">
                  Type of File<span className="text-red-500">*</span>
                </label>
                <select
                  name={`fileType-${index}`}
                  value={file.type}
                  onChange={(e) => {
                    const newFiles = [...formData.files];
                    newFiles[index].type = e.target.value;
                    setFormData({ ...formData, files: newFiles });
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-8"
                >
                  <option value="">Select Type</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Document<span className="text-red-500">*</span>
                </label>
                <div className=' border-2 rounded flex justify-end items-center h-8'>
                  <button
                    type="button"
                    onClick={() => handleIconClick(index)}
                    className=" p-2 mr-1"
                  >
                    <FiUpload />
                  </button>
                </div>
                <input
                  type="file"
                  ref={el => fileInputRefs.current[index] = el}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(index, e)}
                />
              </div>
              {formData.files.length > 1 && index !== 0 && (
                <button
                  type="button"
                  className=" p-1.5 w-7 mt-7  bg-gray-300 rounded "
                  onClick={() => handleRemoveFile(index)}
                >
                  <FaRegTrashCan />
                </button>
              )}
              {index === 0 && (
                <button
                  type="button"
                  className="p-1.5 w-7 mt-7 bg-black text-white rounded "
                  onClick={handleAddFile}
                >
                  <FaPlus />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
