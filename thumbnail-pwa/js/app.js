const NICHE_LABELS = {
  money: 'نيش المال والاستثمار',
  communication: 'نيش مهارات التواصل',
  mental: 'نيش الصحة النفسية',
  productivity: 'نيش الإنتاجية وإدارة الوقت',
  career: 'نيش التطوير المهني'
};

const NICHE_COLORS = {
  money: '#D4AF37',
  communication: '#F5A623',
  mental: '#4A9B7F',
  productivity: '#00CCFF',
  career: '#7B2FBE'
};

document.addEventListener('DOMContentLoaded', function() {
  const courseSelect = document.getElementById('course-select');
  const generateBtn = document.getElementById('generate-btn');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const canvas = document.getElementById('preview-canvas');
  const nicheBadge = document.getElementById('niche-badge');
  const loadingSpinner = document.getElementById('loading-spinner');

  let currentCourse = null;
  let currentDataUrl = null;

  populateCourseDropdown();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  }

  function populateCourseDropdown() {
    const niches = ['money', 'communication', 'mental', 'productivity', 'career'];

    niches.forEach(niche => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = NICHE_LABELS[niche];

      COURSES.filter(c => c.niche === niche).forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.title;
        option.dataset.niche = course.niche;
        optgroup.appendChild(option);
      });

      courseSelect.appendChild(optgroup);
    });
  }

  courseSelect.addEventListener('change', function() {
    const selectedId = parseInt(this.value);
    currentCourse = COURSES.find(c => c.id === selectedId);

    if (currentCourse) {
      updateNicheBadge(currentCourse.niche);
      setTimeout(() => generateThumbnailAsync(false), 100);
    } else {
      nicheBadge.style.display = 'none';
    }
  });

  generateBtn.addEventListener('click', function() {
    if (currentCourse) {
      generateThumbnailAsync(false);
    }
  });

  regenerateBtn.addEventListener('click', function() {
    if (currentCourse) {
      generateThumbnailAsync(true);
    }
  });

  downloadBtn.addEventListener('click', function() {
    if (currentDataUrl && currentCourse) {
      const timestamp = Date.now();
      const filename = `thumbnail-${currentCourse.id}-${timestamp}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = currentDataUrl;
      link.click();
    }
  });

  function updateNicheBadge(niche) {
    nicheBadge.textContent = NICHE_LABELS[niche];
    nicheBadge.style.backgroundColor = NICHE_COLORS[niche];
    nicheBadge.style.display = 'inline-block';
  }

  async function generateThumbnailAsync(forceNew) {
    if (!currentCourse) return;

    showLoading(true);

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      currentDataUrl = generateThumbnail(currentCourse, canvas, forceNew);
      downloadBtn.classList.add('ready');
      downloadBtn.style.display = 'inline-block';
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }

    showLoading(false);
  }

  function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    canvas.style.opacity = show ? '0.5' : '1';
  }
});
