import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getProjectQRCode } from '../api/projects'
import Modal from './Modal'

export default function QRCodeModal({ projectId, projectName, onClose }) {
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadQRCode = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getProjectQRCode(projectId)
      setQrData(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load QR code')
    } finally {
      setLoading(false)
    }
  }

  const copyJoinLink = () => {
    if (qrData?.joinUrl) {
      navigator.clipboard.writeText(qrData.joinUrl)
      // You could add a toast notification here
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="Project QR Code">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-stone-500">
            Scan this QR code to join <span className="font-semibold" style={{ color: '#5300b7' }}>{projectName}</span>
          </p>
        </div>

        {!qrData && !loading && (
          <div className="flex justify-center py-8">
            <button
              onClick={loadQRCode}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
            >
              <span className="material-symbols-outlined text-base">qr_code</span>
              Generate QR Code
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-4xl animate-spin mb-3" style={{ color: '#5300b7' }}>
              progress_activity
            </span>
            <p className="text-sm text-stone-400">Generating QR code...</p>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {qrData && (
          <div className="space-y-4">
            {/* QR Code Display */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-stone-100">
              <div className="p-4 bg-white rounded-lg border-2 border-stone-100">
                <QRCodeSVG 
                  value={qrData.joinUrl}
                  size={220}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '',
                    height: 0,
                    width: 0,
                    excavate: true,
                  }}
                />
              </div>
              <p className="text-xs text-stone-400 mt-4 text-center">
                Scan with your phone camera to join
              </p>
            </div>

            {/* Join Link */}
            <div className="bg-surface-container-low rounded-lg p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-stone-500 mb-2">
                Join Link
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrData.joinUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded border border-stone-200 bg-white text-xs text-stone-600"
                />
                <button
                  onClick={copyJoinLink}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
                  title="Copy link"
                >
                  <span className="material-symbols-outlined text-base">content_copy</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-surface-container-low rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-stone-700">How to join:</p>
              <ol className="text-xs text-stone-500 space-y-1 list-decimal list-inside">
                <li>Open your phone camera</li>
                <li>Point it at the QR code</li>
                <li>Tap the notification to open the link</li>
                <li>Sign in (if not already) and join the project</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
