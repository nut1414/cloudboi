import React, { useState } from 'react'
import PageContainer from '../../components/Layout/PageContainer'
import Button from '../../components/Common/Button/Button'
import PageAlert from '../../components/Common/PageAlert'
import useToast from '../../hooks/useToast'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const SupportPage: React.FC = () => {
  const toast = useToast();
  const [showPageAlert, setShowPageAlert] = useState(true);

  const showSuccessToast = () => {
    toast.success('This is a success toast notification that will auto-dismiss');
  };

  const showErrorToast = () => {
    toast.error('This is an error toast notification that will auto-dismiss');
  };

  const showInfoToast = () => {
    toast.info('This is an info toast notification that will auto-dismiss');
  };

  const showWarningToast = () => {
    toast.warning('This is a warning toast notification that will auto-dismiss');
  };

  const showPersistentToast = () => {
    toast.info('This is a persistent toast notification that requires dismissal', false);
  };

  const showMultipleToasts = () => {
    // Clear any existing notifications first
    for (let i = 1; i <= 6; i++) {
      // Add increasing delay to each notification to demonstrate the limit behavior better
      setTimeout(() => {
        if (i <= 5) {
          toast.info(`Notification ${i} of 6 - This will stay visible`);
        } else {
          toast.success('Notification 6 of 6 - This should replace the oldest notification');
        }
      }, i * 300); // Spread them out by 300ms each
    }
  };

  return (
    <PageContainer
      title="Support & Help"
      subtitle="Find help and resources for using Cloud Platform"
      subtitleIcon={<QuestionMarkCircleIcon className="h-4 w-4" />}
    >
      <div className="space-y-8">
        {showPageAlert && (
          <PageAlert
            type="info"
            title="Welcome to Support Center"
            message="This is a persistent page alert that's part of the page layout. It will stay visible until dismissed."
            onClose={() => setShowPageAlert(false)}
          />
        )}

        <div className="bg-[#192A51] rounded-xl p-6 shadow-lg border border-blue-900/30">
          <h2 className="text-xl font-bold text-white mb-4">Toast Notification Examples</h2>
          <p className="text-gray-300 mb-6">
            Click the buttons below to see different types of toast notifications.
            These appear at the top-right of the screen and automatically dismiss after 5 seconds.
            A maximum of 5 notifications can be shown at once.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              label="Show Success Toast" 
              variant="primary" 
              onClick={showSuccessToast} 
            />
            <Button 
              label="Show Error Toast" 
              variant="danger" 
              onClick={showErrorToast} 
            />
            <Button 
              label="Show Info Toast" 
              variant="info" 
              onClick={showInfoToast} 
            />
            <Button 
              label="Show Warning Toast" 
              variant="primary" 
              onClick={showWarningToast} 
            />
            <Button 
              label="Show Persistent Toast" 
              variant="outline" 
              onClick={showPersistentToast} 
            />
            <Button 
              label="Test 5 Notification Limit" 
              variant="purple" 
              onClick={showMultipleToasts} 
              className="col-span-1 md:col-span-2"
            />
          </div>
        </div>

        <div className="bg-[#192A51] rounded-xl p-6 shadow-lg border border-blue-900/30">
          <h2 className="text-xl font-bold text-white mb-4">In-Page Alert Examples</h2>
          <p className="text-gray-300 mb-6">
            Below are examples of all the alert types that can be used inline in pages.
          </p>
          
          <div className="space-y-4">
            <PageAlert
              type="success"
              message="This is a success alert that's part of the page layout."
            />
            
            <PageAlert
              type="error"
              message="This is an error alert that's part of the page layout."
            />
            
            <PageAlert
              type="info"
              message="This is an info alert that's part of the page layout."
            />
            
            <PageAlert
              type="warning"
              message="This is a warning alert that's part of the page layout."
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default React.memo(SupportPage)