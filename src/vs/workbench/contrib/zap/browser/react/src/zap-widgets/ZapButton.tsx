import React from 'react';
import '../styles.css';

interface ZapButtonProps {
  zapContent?: string;
}

export const ZapButton = (props: ZapButtonProps) => {
  const hasContent = props.zapContent && props.zapContent.trim().length > 0;

  return (
    <div className="custom-container">
      <div>
        <h1 className="custom-header">ZAP File Viewer</h1>
        <button className="custom-button">
          {hasContent ? 'ZAP File Loaded' : 'No ZAP Content'}
        </button>
        {hasContent && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
            <strong>Content Preview:</strong>
            <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {props.zapContent?.substring(0, 500)}
              {props.zapContent && props.zapContent.length > 500 ? '...' : ''}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
