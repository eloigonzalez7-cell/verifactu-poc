import PropTypes from 'prop-types'

function A4Sheet({ children }) {
  return (
    <section
      className="a4-sheet relative mx-auto w-full max-w-[900px] rounded-xl bg-white p-8 text-gray-900 shadow-xl print:shadow-none"
      style={{ aspectRatio: '210 / 297' }}
      aria-label="Hoja de factura A4"
    >
      <div className="flex h-full flex-col gap-6">
        {children}
      </div>
    </section>
  )
}

A4Sheet.propTypes = {
  children: PropTypes.node
}

export default A4Sheet
