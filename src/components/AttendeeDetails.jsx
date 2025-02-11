'use client'
import Image from 'next/image';
import React, { useState, useRef, forwardRef, useEffect } from 'react'

const AttendeeDetails = forwardRef(({ onSubmit }, ref) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    photo: ''
  });

  // Load saved values from localStorage on mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
    if (savedDetails) {
      if (savedDetails.photo) setImageUrl(savedDetails.photo);
      if (savedDetails.name) fileInputRef.current.form.name.value = savedDetails.name;
      if (savedDetails.email) fileInputRef.current.form.email.value = savedDetails.email;
    }
  }, []);

  // Upload image to Cloudinary and get link
  const uploadToCloudinary = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append("upload_preset", "ml_default");
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url);
      setFormErrors(prev => ({...prev, photo: ''}));

      // Save photo URL to localStorage
      const existingDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
      localStorage.setItem('ticketDetails', JSON.stringify({
        ...existingDetails,
        photo: data.secure_url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setFormErrors(prev => ({...prev, photo: 'Failed to upload image'}));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop image
  const handleDrop = async (e) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadToCloudinary(file);
    }
  };

  // Handle click image
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change (replaces the image and triggers the upload)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadToCloudinary(file);
    }
  };

  // Handle name change (checks if the name is empty and sets the error if it is)
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (!value.trim()) {
      setFormErrors(prev => ({...prev, name: 'Please enter your name'}));
    } else {
      setFormErrors(prev => ({...prev, name: ''}));
      // Save name to localStorage
      const existingDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
      localStorage.setItem('ticketDetails', JSON.stringify({
        ...existingDetails,
        name: value
      }));
    }
  };

  // Handle email change (checks if the email is valid and sets the error if it is not)
  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setFormErrors(prev => ({...prev, email: 'Please enter your email'}));
    } else if (!emailRegex.test(value)) {
      setFormErrors(prev => ({...prev, email: 'Please enter a valid email'}));
    } else {
      setFormErrors(prev => ({...prev, email: ''}));
      // Save email to localStorage
      const existingDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
      localStorage.setItem('ticketDetails', JSON.stringify({
        ...existingDetails,
        email: value
      }));
    }
  };

  // Handle submit (checks if the image, name, and email are valid and saves the data to local storage)
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    
    if (!imageUrl) {
      setFormErrors(prev => ({...prev, photo: 'Please upload a profile photo'}));
      hasErrors = true;
    }
    if (!e.target.name.value.trim()) {
      setFormErrors(prev => ({...prev, name: 'Please enter your name'}));
      hasErrors = true;
    }
    if (!e.target.email.value.trim()) {
      setFormErrors(prev => ({...prev, email: 'Please enter your email'}));
      hasErrors = true;
    }

    if (!hasErrors) {
      const attendeeData = {
        name: e.target.name.value,
        email: e.target.email.value,
        photo: imageUrl
      };

      // Get existing ticket details and merge with attendee data
      const existingDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
      const updatedDetails = {
        ...existingDetails,
        ...attendeeData
      };
      
      // Save updated details back to localStorage
      localStorage.setItem('ticketDetails', JSON.stringify(updatedDetails));

      onSubmit({
        success: true
      });
    } else {
      onSubmit({ success: false });
    }
  };

  // Handle key press (opens the file input when the user presses enter or space) - accessibility
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div className='space-y-8 w-full font-roboto' role="main">
      <form className='space-y-8' onSubmit={handleSubmit} ref={ref} noValidate>
        {/* Upload Profile Photo */}
        <div className='border border-borderthree bg-greenfive rounded-3xl p-6 w-full'>
          <h3 className='mb-5' id="upload-section">Upload Profile Photo</h3>
          <div className='bg-black/20 flex justify-center items-center w-full'>
            <div
              className='w-full max-w-[240px] h-[240px] bg-bordertwo rounded-[32px] p-6 flex flex-col gap-2 justify-center items-center relative cursor-pointer group focus-within:ring-2 focus-within:ring-borderone'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              onKeyPress={handleKeyPress}
              role="button"
              tabIndex="0"
              aria-label="Upload profile photo. Drag and drop an image or click to select a file"
              aria-describedby={formErrors.photo ? "photo-error" : undefined}
            >
              {imageUrl ? (
                <>
                  <Image 
                    src={imageUrl} 
                    alt="Uploaded profile" 
                    fill
                    className='object-cover rounded-[32px]'
                  />
                  <div className='absolute inset-0 bg-black/30 rounded-[32px] opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex flex-col gap-2 justify-center items-center'>
                    {isUploading ? (
                      <p className='text-center' role="status">Uploading...</p>
                    ) : (
                      <>
                        <Image src="/upload.svg" alt="" role="presentation" width={32} height={32} />
                        <p className='text-center'>Drag & Drop or Click to Upload</p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {isUploading ? (
                    <p className='text-center' role="status">Uploading...</p>
                  ) : (
                    <>
                      <Image src="/upload.svg" alt="" role="presentation" width={32} height={32} />
                      <p className='text-center'>Drag & Drop or Click to Upload</p>
                    </>
                  )}
                </>
              )}
              <input 
                type="file" 
                className='hidden' 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                aria-label="Choose profile photo"
                required
                aria-required="true"
              />
            </div>
          </div>
          {formErrors.photo && (
            <span id="photo-error" className="text-red-500 text-sm mt-2 block" role="alert">
              {formErrors.photo}
            </span>
          )}
        </div>
        
        {/* Separator */}
        <div className='bg-borderthree h-1' role="separator" />

        {/* Attendee Details */}
        {/* Name */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='name' className='text-lightgrey'>
            Enter your name <span aria-label="required">*</span>
          </label>
          <input 
            type='text' 
            id='name' 
            required
            aria-required="true"
            aria-invalid={!!formErrors.name}
            aria-describedby={formErrors.name ? "name-error" : undefined}
            className='w-full bg-transparent border border-borderthree rounded-xl p-2 h-12 focus:outline-none focus:ring-2 focus:ring-borderone hover:border-borderone transition-colors'
            onChange={handleNameChange}
            onBlur={handleNameChange}
          />
          {formErrors.name && (
            <span id="name-error" className="text-red-500 text-sm" role="alert">
              {formErrors.name}
            </span>
          )}
        </div>
        {/* Email */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className='text-lightgrey'>
            Enter your email <span aria-label="required">*</span>
          </label>
          <div className='flex items-center w-full border border-borderthree rounded-xl h-12 overflow-hidden group hover:border-borderone focus-within:ring-2 focus-within:ring-borderone transition-colors'>
            <div className='pl-3 pr-1'>
              <Image src="/email.svg" alt="" role="presentation" width={24} height={24} />
            </div>
            <input 
              type='email' 
              id='email' 
              required
              aria-required="true"
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              className='flex-1 bg-transparent p-2 outline-none'
              onChange={handleEmailChange}
              onBlur={handleEmailChange}
            />
          </div>
          {formErrors.email && (
            <span id="email-error" className="text-red-500 text-sm" role="alert">
              {formErrors.email}
            </span>
          )}
        </div>
      </form>
    </div>
  )
});

AttendeeDetails.displayName = 'AttendeeDetails';

export default AttendeeDetails;
