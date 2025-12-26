import { useMemo } from 'react'

export default function BackgroundPicker({
  bgMode,
  cardColor,
  bgImage,
  colorOptions,
  presetImages,
  onChange,
  labels = {
    background: 'Background',
    color: 'Color',
    image: 'Image',
    cardColor: 'Card Color',
    chooseImage: 'Choose a Background Image',
  },
}) {
  const previewStyle = useMemo(() => {
    const base = { background: cardColor }
    if (bgMode === 'image' && (bgImage || '').trim()) {
      return {
        ...base,
        backgroundImage: `url(${bgImage.trim()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return base
  }, [bgMode, bgImage, cardColor])

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div>
        <label>{labels.background}</label>
        <div className="segmented">
          <button
            type="button"
            className={bgMode === 'color' ? 'active' : ''}
            onClick={() => onChange({ bgMode: 'color' })}
          >
            {labels.color}
          </button>
          <button
            type="button"
            className={bgMode === 'image' ? 'active' : ''}
            onClick={() => onChange({ bgMode: 'image' })}
          >
            {labels.image}
          </button>
        </div>
      </div>

      {bgMode === 'color' && (
        <div>
          <label>{labels.cardColor}</label>
          <div className="color-row">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                className={`color-swatch ${cardColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => onChange({ cardColor: color })}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {bgMode === 'image' && (
        <div>
          <label>{labels.chooseImage}</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}
          >
            {presetImages.map(src => (
              <button
                key={src}
                type="button"
                onClick={() => onChange({ bgMode: 'image', bgImage: src })}
                style={{
                  border: bgImage === src ? '3px solid #111' : '1px solid #111',
                  borderRadius: 12,
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: 'transparent',
                }}
                aria-label="Select preset background"
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <input type="hidden" value={JSON.stringify(previewStyle)} readOnly />
    </div>
  )
}

export function buildPreviewStyle({ bgMode, bgImage, cardColor }) {
  const base = { background: cardColor }
  if (bgMode === 'image' && (bgImage || '').trim()) {
    return {
      ...base,
      backgroundImage: `url(${bgImage.trim()})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return base
}
