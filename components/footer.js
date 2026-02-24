/* =========================
   SHARED FOOTER COMPONENT
   Simple footer with copyright info and links
   Usage: <script src="./components/footer.js"></script>
   ========================= */

const Footer = ({ theme }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div style={{
      marginTop: '48px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '20px 32px',
        borderRadius: '16px',
        maxWidth: '800px',
        margin: '0 auto',
        backdropFilter: 'blur(8px)'
      }}>
        <p className="font-courier" style={{
          color: '#ffffff',
          fontSize: '0.875rem',
          marginBottom: '8px',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)'
        }}>
          <strong>Homestuck</strong> and all related characters and concepts, including the Extended Zodiac, are © Andrew Hussie. <strong>Homestuck: Beyond Canon</strong> and its related content belong to Furthest Ring Studios.
        </p>
        <p className="font-courier" style={{
          color: '#eeeeee',
          fontSize: '0.75rem',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}>
          The Classpect Connector by Nino Roshi, {currentYear}. Fan-made analysis tool.
        </p>
      </div>
    </div>
  );
};