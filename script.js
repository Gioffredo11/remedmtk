/**
 * MATHEMATICAL JOURNAL : INTERACTIVE SCRIPTS
 * Modules: KaTeX Auto-renderer, Reading Progress, Sticky Nav,
 * Active Link Spy, Interactive Math Simulators, Quiz Engine,
 * Copy to Clipboard, and Theme Management.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. KATEX AUTO-RENDER INITIALIZATION
  // =========================================================================
  const renderMathContent = () => {
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        errorColor: '#9B2C2C'
      });
    }
  };

  // Run render initially, and poll briefly if script tag loads async
  renderMathContent();
  setTimeout(renderMathContent, 300);
  setTimeout(renderMathContent, 1000);


  // =========================================================================
  // 2. READING PROGRESS BAR & STICKY HEADER
  // =========================================================================
  const readingProgressBar = document.getElementById('readingProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const btnBackToTop = document.getElementById('btnBackToTop');

  const handleScrollEffects = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update progress bar
    if (docHeight > 0 && readingProgressBar) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      readingProgressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Toggle header shadow on scroll
    if (siteHeader) {
      if (scrollTop > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Toggle back to top visibility
    if (btnBackToTop) {
      if (scrollTop > 400) {
        btnBackToTop.classList.add('visible');
      } else {
        btnBackToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // =========================================================================
  // 3. MOBILE NAVIGATION MENU TOGGLE
  // =========================================================================
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (menuToggleBtn && navMenu) {
    const setMenuState = (open) => {
      const isOpen = Boolean(open);
      navMenu.classList.toggle('open', isOpen);
      menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    };

    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextState = !navMenu.classList.contains('open');
      setMenuState(nextState);
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close menu when clicking outside of navMenu and menuToggleBtn
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });

    // Automatically reset when resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });
  }



  // =========================================================================
  // 4. ACTIVE NAVIGATION LINK SPY (INTERSECTION OBSERVER)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  // =========================================================================
  // 5. INTERACTIVE TOOL 1 : FUNCTION EVALUATOR (BAB 01)
  // Formula: f(x) = 2x + 3
  // =========================================================================
  const evalInputX = document.getElementById('evalInputX');
  const btnEvalFunction = document.getElementById('btnEvalFunction');
  const valInputDisplay = document.getElementById('valInputDisplay');
  const valOutputDisplay = document.getElementById('valOutputDisplay');
  const evalExplanationText = document.getElementById('evalExplanationText');

  const runFunctionEvaluation = () => {
    if (!evalInputX) return;
    const xVal = parseFloat(evalInputX.value);
    if (isNaN(xVal)) {
      alert('Mohon masukkan angka yang valid.');
      return;
    }

    const result = (2 * xVal) + 3;
    const formattedResult = Number.isInteger(result) ? result : result.toFixed(2);
    const formattedX = Number.isInteger(xVal) ? xVal : xVal.toFixed(2);

    if (valInputDisplay) valInputDisplay.textContent = formattedX;
    if (valOutputDisplay) valOutputDisplay.textContent = formattedResult;

    if (evalExplanationText) {
      evalExplanationText.innerHTML = `Perhitungan: $f(${formattedX}) = 2(${formattedX}) + 3 = ${formattedResult}$. Pasangan koordinat: $(${formattedX}, ${formattedResult})$.`;
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(evalExplanationText, {
          delimiters: [{ left: '$', right: '$', display: false }],
          throwOnError: false
        });
      }
    }
  };

  if (btnEvalFunction) {
    btnEvalFunction.addEventListener('click', runFunctionEvaluation);
  }
  if (evalInputX) {
    evalInputX.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runFunctionEvaluation();
    });
  }


  // =========================================================================
  // 6. INTERACTIVE TOOL 2 : COMPOSITION FLOW SANDBOX (BAB 02)
  // f(x) = 2x + 3, g(x) = x^2 - 1
  // Alur A: (f o g)(x) = f(g(x)) = 2(x^2 - 1) + 3 = 2x^2 + 1
  // Alur B: (g o f)(x) = g(f(x)) = (2x + 3)^2 - 1 = 4x^2 + 12x + 8
  // =========================================================================
  const compInputX = document.getElementById('compInputX');
  const btnRunComposition = document.getElementById('btnRunComposition');
  const pathASteps = document.getElementById('pathASteps');
  const pathBSteps = document.getElementById('pathBSteps');
  const compVerdict = document.getElementById('compVerdict');

  const runCompositionSandbox = () => {
    if (!compInputX) return;
    const xVal = parseFloat(compInputX.value);
    if (isNaN(xVal)) {
      alert('Mohon masukkan bilangan riil yang valid.');
      return;
    }

    const fmtX = Number.isInteger(xVal) ? xVal : xVal.toFixed(2);

    // Alur A : f(g(x))
    const gVal = (xVal * xVal) - 1;
    const fogVal = (2 * gVal) + 3;
    const fmtG = Number.isInteger(gVal) ? gVal : gVal.toFixed(2);
    const fmtFog = Number.isInteger(fogVal) ? fogVal : fogVal.toFixed(2);

    // Alur B : g(f(x))
    const fVal = (2 * xVal) + 3;
    const gofVal = (fVal * fVal) - 1;
    const fmtF = Number.isInteger(fVal) ? fVal : fVal.toFixed(2);
    const fmtGof = Number.isInteger(gofVal) ? gofVal : gofVal.toFixed(2);

    if (pathASteps) {
      pathASteps.innerHTML = `
        <div class="p-step">Tahap 1: $g(${fmtX}) = (${fmtX})^2 - 1 = ${fmtG}$</div>
        <div class="p-step">Tahap 2: $f(${fmtG}) = 2(${fmtG}) + 3 = ${fmtFog}$</div>
        <div class="p-step-final">Hasil: $(f \\circ g)(${fmtX}) = ${fmtFog}$</div>
      `;
    }

    if (pathBSteps) {
      pathBSteps.innerHTML = `
        <div class="p-step">Tahap 1: $f(${fmtX}) = 2(${fmtX}) + 3 = ${fmtF}$</div>
        <div class="p-step">Tahap 2: $g(${fmtF}) = (${fmtF})^2 - 1 = ${fmtGof}$</div>
        <div class="p-step-final">Hasil: $(g \\circ f)(${fmtX}) = ${fmtGof}$</div>
      `;
    }

    if (compVerdict) {
      const isDifferent = Math.abs(fogVal - gofVal) > 0.0001;
      compVerdict.innerHTML = isDifferent 
        ? `Perbandingan Nilai: $${fmtFog} \\ne ${fmtGof}$. Terbukti secara numerik bahwa $(f \\circ g)(${fmtX}) \\ne (g \\circ f)(${fmtX})$.`
        : `Pada titik kebetulan ini nilainya sama ($${fmtFog} = ${fmtGof}$), namun secara umum rumus aljabarnya tetap berbeda jauh ($2x^2+1 \\ne 4x^2+12x+8$).`;
    }

    // Re-render KaTeX on updated sandbox nodes
    if (typeof renderMathInElement === 'function') {
      if (pathASteps) renderMathInElement(pathASteps, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      if (pathBSteps) renderMathInElement(pathBSteps, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      if (compVerdict) renderMathInElement(compVerdict, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
    }
  };

  if (btnRunComposition) {
    btnRunComposition.addEventListener('click', runCompositionSandbox);
  }
  if (compInputX) {
    compInputX.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runCompositionSandbox();
    });
  }


  // =========================================================================
  // 7. INTERACTIVE TOOL 3 : INVERSE CYCLE VERIFIER (BAB 03)
  // f(x) = 3x - 6, f^-1(y) = (y + 6) / 3
  // =========================================================================
  const invInputX = document.getElementById('invInputX');
  const btnRunInverseTest = document.getElementById('btnRunInverseTest');
  const cyInitial = document.getElementById('cyInitial');
  const cyTransformed = document.getElementById('cyTransformed');
  const cyRestored = document.getElementById('cyRestored');
  const cySummaryText = document.getElementById('cySummaryText');

  const runInverseVerification = () => {
    if (!invInputX) return;
    const xVal = parseFloat(invInputX.value);
    if (isNaN(xVal)) {
      alert('Mohon masukkan angka masukan yang sah.');
      return;
    }

    const fmtX = Number.isInteger(xVal) ? xVal : xVal.toFixed(2);
    const yVal = (3 * xVal) - 6;
    const fmtY = Number.isInteger(yVal) ? yVal : yVal.toFixed(2);

    const xRestored = (yVal + 6) / 3;
    const fmtRestored = Number.isInteger(xRestored) ? xRestored : xRestored.toFixed(2);

    if (cyInitial) cyInitial.textContent = fmtX;
    if (cyTransformed) cyTransformed.textContent = fmtY;
    if (cyRestored) cyRestored.textContent = fmtRestored;

    if (cySummaryText) {
      cySummaryText.innerHTML = `Sifat Terbukti: Masukan asal $x = ${fmtX}$ menghasilkan keluaran $y = ${fmtY}$, dan ketika dimasukkan ke fungsi invers $f^{-1}(${fmtY}) = \\frac{${fmtY} + 6}{3}$, nilainya kembali sempurna menjadi $x = ${fmtRestored}$.`;
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(cySummaryText, {
          delimiters: [{ left: '$', right: '$', display: false }],
          throwOnError: false
        });
      }
    }
  };

  if (btnRunInverseTest) {
    btnRunInverseTest.addEventListener('click', runInverseVerification);
  }
  if (invInputX) {
    invInputX.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runInverseVerification();
    });
  }


  // =========================================================================
  // 8. COPY LATEX FORMULA TO CLIPBOARD WITH TOAST
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  const showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2600);
  };

  const copyButtons = document.querySelectorAll('.btn-copy-eq');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const formula = btn.getAttribute('data-formula');
      if (!formula) return;

      try {
        await navigator.clipboard.writeText(formula);
        const originalText = btn.textContent;
        btn.textContent = 'Tersalin!';
        showToast(`Teks berhasil disalin: ${formula}`);
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1800);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = formula;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Teks berhasil disalin: ${formula}`);
      }
    });
  });


  // =========================================================================
  // 9. INTERACTIVE QUIZ ENGINE (BAB 06)
  // Answer Key:
  // Q0: A (6x - 14)
  // Q1: B (8)
  // Q2: B ((x + 8)/4)
  // Q3: A ((2x + 1)/(x - 1))
  // Q4: B (3)
  // =========================================================================
  const quizAnswers = {
    0: 'A',
    1: 'B',
    2: 'B',
    3: 'A',
    4: 'B'
  };

  const answeredState = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  };

  const checkButtons = document.querySelectorAll('.btn-check-answer');
  const quizCards = document.querySelectorAll('.quiz-card');
  const finalScoreVal = document.getElementById('finalScoreVal');
  const scorePercentVal = document.getElementById('scorePercentVal');
  const scoreFeedbackMsg = document.getElementById('scoreFeedbackMsg');
  const btnResetQuiz = document.getElementById('btnResetQuiz');

  const updateQuizSummary = () => {
    let totalAnswered = 0;
    let correctCount = 0;

    Object.keys(answeredState).forEach(qIdx => {
      if (answeredState[qIdx] !== null) {
        totalAnswered++;
        if (answeredState[qIdx] === true) {
          correctCount++;
        }
      }
    });

    if (finalScoreVal) finalScoreVal.textContent = correctCount;
    
    const percentage = Math.round((correctCount / 5) * 100);
    if (scorePercentVal) scorePercentVal.textContent = `${percentage}% Capaian`;

    if (scoreFeedbackMsg) {
      if (totalAnswered === 0) {
        scoreFeedbackMsg.textContent = 'Silakan jawab semua soal di atas dan periksa jawaban Anda untuk melihat rekapitulasi penilaian akhir.';
      } else if (totalAnswered < 5) {
        scoreFeedbackMsg.textContent = `Anda telah memeriksa ${totalAnswered} dari 5 soal. Selesaikan seluruh soal untuk memperoleh evaluasi pemahaman yang utuh.`;
      } else {
        if (correctCount === 5) {
          scoreFeedbackMsg.textContent = 'Luar biasa! Pemahaman Anda sangat mendalam dan sempurna pada konsep fungsi komposisi maupun fungsi invers aljabar.';
        } else if (correctCount >= 3) {
          scoreFeedbackMsg.textContent = 'Bagus! Anda telah menguasai konsep inti dengan baik. Silakan pelajari kembali pembahasan pada nomor yang masih keliru untuk menyempurnakan kompetensi remedial Anda.';
        } else {
          scoreFeedbackMsg.textContent = 'Tetap semangat! Pelajari kembali Bab 02 dan Bab 03 secara teliti, amati langkah-langkah aljabar pada Contoh Soal Bab 05, lalu ulangi kuis ini.';
        }
      }
    }
  };

  checkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = parseInt(btn.getAttribute('data-target'), 10);
      const selectedRadio = document.querySelector(`input[name="question-${qIdx}"]:checked`);

      if (!selectedRadio) {
        alert('Silakan pilih salah satu opsi jawaban (A, B, C, atau D) sebelum memeriksa.');
        return;
      }

      const selectedValue = selectedRadio.value;
      const isCorrect = (selectedValue === quizAnswers[qIdx]);
      answeredState[qIdx] = isCorrect;

      const card = document.querySelector(`.quiz-card[data-qindex="${qIdx}"]`);
      const feedbackBox = document.getElementById(`feedback-${qIdx}`);
      const feedbackStatus = feedbackBox ? feedbackBox.querySelector('.feedback-status') : null;

      if (card) {
        card.classList.remove('answered-correct', 'answered-incorrect');
        card.classList.add(isCorrect ? 'answered-correct' : 'answered-incorrect');
      }

      if (feedbackBox) {
        feedbackBox.classList.remove('hidden', 'correct', 'incorrect');
        feedbackBox.classList.add(isCorrect ? 'correct' : 'incorrect');
      }

      if (feedbackStatus) {
        feedbackStatus.textContent = isCorrect 
          ? 'Tepat Sekali! Jawaban Anda Benar.' 
          : `Kurang Tepat. Anda memilih opsi (${selectedValue}). Perhatikan pembahasan berikut:`;
      }

      // Disable check button after checking to prevent spam
      btn.textContent = 'Sudah Diperiksa';
      btn.disabled = true;

      // Update summary tally
      updateQuizSummary();
    });
  });

  // Reset Quiz
  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      // Uncheck all radios
      const radios = document.querySelectorAll('.q-radio');
      radios.forEach(r => { r.checked = false; });

      // Reset card borders & feedbacks
      quizCards.forEach(card => {
        card.classList.remove('answered-correct', 'answered-incorrect');
      });

      for (let i = 0; i < 5; i++) {
        answeredState[i] = null;
        const fb = document.getElementById(`feedback-${i}`);
        if (fb) fb.classList.add('hidden');
        const btn = document.querySelector(`.btn-check-answer[data-target="${i}"]`);
        if (btn) {
          btn.textContent = 'Periksa Jawaban';
          btn.disabled = false;
        }
      }

      updateQuizSummary();
      showToast('Kuis latihan telah direset. Silakan coba kembali.');
    });
  }


  // =========================================================================
  // 10. THEME SWITCHER (WARM IVORY / SCHOLAR DARK)
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('math_journal_theme') || 'light';

  document.body.setAttribute('data-theme', storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('math_journal_theme', newTheme);
      showToast(`Tema visual diubah ke: ${newTheme === 'dark' ? 'Scholar Dark' : 'Warm Ivory Journal'}`);
    });
  }


  // =========================================================================
  // 11. LABORATORIUM PRAKTIK PERHITUNGAN (INTERACTIVE WORKBENCH)
  // =========================================================================

  // --- A. TAB SWITCHING ---
  const labTabBtns = document.querySelectorAll('.lab-tab-btn');
  const labTabPanels = document.querySelectorAll('.lab-tab-panel');

  labTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      labTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      labTabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        renderMathContent();
      }
    });
  });


  // --- B. MODUL 1: PRAKTIK KOMPOSISI FUNGSI KUSTOM ---
  const compCoeffA = document.getElementById('compCoeffA');
  const compConstB = document.getElementById('compConstB');
  const compTypeG = document.getElementById('compTypeG');
  const compCoeffC = document.getElementById('compCoeffC');
  const compConstD = document.getElementById('compConstD');
  const labCompInputX = document.getElementById('labCompInputX');
  const previewFormulaF = document.getElementById('previewFormulaF');
  const previewFormulaG = document.getElementById('previewFormulaG');
  const btnCalculateCompLab = document.getElementById('btnCalculateCompLab');
  const labCompResults = document.getElementById('labCompResults');
  const compPresetBtns = document.querySelectorAll('[data-comp-preset]');

  const formatSignNumber = (num, withVariable = '') => {
    if (withVariable) {
      if (num === 0) return '';
      if (num === 1) return `+ ${withVariable}`;
      if (num === -1) return `- ${withVariable}`;
      return num > 0 ? `+ ${num}${withVariable}` : `- ${Math.abs(num)}${withVariable}`;
    }
    if (num === 0) return '';
    return num > 0 ? `+ ${num}` : `- ${Math.abs(num)}`;
  };

  const updateCompPreviews = () => {
    if (!compCoeffA || !compConstB || !compTypeG || !compCoeffC || !compConstD) return;
    const a = parseFloat(compCoeffA.value) || 0;
    const b = parseFloat(compConstB.value) || 0;
    const typeG = compTypeG.value;
    const c = parseFloat(compCoeffC.value) || 0;
    const d = parseFloat(compConstD.value) || 0;

    // Preview f(x) = ax + b
    const termA = a === 1 ? 'x' : (a === -1 ? '-x' : `${a}x`);
    const termB = b !== 0 ? formatSignNumber(b) : '';
    const formulaFStr = `$$f(x) = ${termA} ${termB}$$`;
    if (previewFormulaF) {
      previewFormulaF.innerHTML = formulaFStr;
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(previewFormulaF, { delimiters: [{ left: '$$', right: '$$', display: true }], throwOnError: false });
      }
    }

    // Preview g(x)
    let formulaGStr = '';
    if (typeG === 'quad') {
      const termC = c === 1 ? 'x^2' : (c === -1 ? '-x^2' : `${c}x^2`);
      const termD = d !== 0 ? formatSignNumber(d) : '';
      formulaGStr = `$$g(x) = ${termC} ${termD}$$`;
    } else {
      const termC = c === 1 ? 'x' : (c === -1 ? '-x' : `${c}x`);
      const termD = d !== 0 ? formatSignNumber(d) : '';
      formulaGStr = `$$g(x) = ${termC} ${termD}$$`;
    }
    if (previewFormulaG) {
      previewFormulaG.innerHTML = formulaGStr;
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(previewFormulaG, { delimiters: [{ left: '$$', right: '$$', display: true }], throwOnError: false });
      }
    }
  };

  [compCoeffA, compConstB, compTypeG, compCoeffC, compConstD].forEach(el => {
    if (el) el.addEventListener('input', updateCompPreviews);
  });

  // Presets Komposisi
  compPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.getAttribute('data-comp-preset');

      if (presetKey === 'compPreset1') {
        // Linear & Kuadrat: f(x) = 2x + 3, g(x) = x^2 - 1
        compCoeffA.value = 2;
        compConstB.value = 3;
        compTypeG.value = 'quad';
        compCoeffC.value = 1;
        compConstD.value = -1;
      } else if (presetKey === 'compPreset2') {
        // Linear & Linear: f(x) = 3x - 4, g(x) = 2x + 5
        compCoeffA.value = 3;
        compConstB.value = -4;
        compTypeG.value = 'lin';
        compCoeffC.value = 2;
        compConstD.value = 5;
      } else if (presetKey === 'compPreset3') {
        // Linear & Kuadrat: f(x) = x + 5, g(x) = 3x^2 - 2
        compCoeffA.value = 1;
        compConstB.value = 5;
        compTypeG.value = 'quad';
        compCoeffC.value = 3;
        compConstD.value = -2;
      }
      updateCompPreviews();
      runCompLabCalculation();
    });
  });

  const runCompLabCalculation = () => {
    if (!labCompResults || !compCoeffA || !compConstB || !compTypeG || !compCoeffC || !compConstD || !labCompInputX) return;

    const a = parseFloat(compCoeffA.value) || 0;
    const b = parseFloat(compConstB.value) || 0;
    const typeG = compTypeG.value;
    const c = parseFloat(compCoeffC.value) || 0;
    const d = parseFloat(compConstD.value) || 0;
    const x = parseFloat(labCompInputX.value) || 0;

    let gOfX, fogOfX, fOfX, gofOfX;
    let fogFormulaStr, gofFormulaStr;
    let fogStepsHtml, gofStepsHtml;

    if (typeG === 'quad') {
      // g(x) = cx^2 + d
      gOfX = (c * x * x) + d;
      fogOfX = (a * gOfX) + b;

      fOfX = (a * x) + b;
      gofOfX = (c * fOfX * fOfX) + d;

      // Aljabar (f o g)(x) = a(c x^2 + d) + b = (ac) x^2 + (ad + b)
      const ac = a * c;
      const ad_b = (a * d) + b;
      const termAC = ac === 1 ? 'x^2' : (ac === -1 ? '-x^2' : `${ac}x^2`);
      const termAD_B = ad_b !== 0 ? formatSignNumber(ad_b) : '';
      fogFormulaStr = `(f \\circ g)(x) = ${termAC} ${termAD_B}`;

      // Aljabar (g o f)(x) = c(ax + b)^2 + d = c(a^2 x^2 + 2ab x + b^2) + d
      const ca2 = c * a * a;
      const c2ab = 2 * c * a * b;
      const cb2_d = (c * b * b) + d;
      const termCA2 = ca2 === 1 ? 'x^2' : (ca2 === -1 ? '-x^2' : `${ca2}x^2`);
      const termC2AB = c2ab !== 0 ? formatSignNumber(c2ab, 'x') : '';
      const termCB2_D = cb2_d !== 0 ? formatSignNumber(cb2_d) : '';
      gofFormulaStr = `(g \\circ f)(x) = ${termCA2} ${termC2AB} ${termCB2_D}`;

      fogStepsHtml = `
        <li>Substitusikan $g(x)$: $(f \\circ g)(x) = f(${c === 1 ? 'x^2' : c + 'x^2'} ${formatSignNumber(d)}) = ${a}(${c === 1 ? 'x^2' : c + 'x^2'} ${formatSignNumber(d)}) ${formatSignNumber(b)}$.</li>
        <li>Distribusi aljabar: $= ${fogFormulaStr}$.</li>
        <li>Evaluasi numerik pada masukan $x = ${x}$:<br>
          $g(${x}) = ${c}(${x})^2 ${formatSignNumber(d)} = ${gOfX}$<br>
          $f(${gOfX}) = ${a}(${gOfX}) ${formatSignNumber(b)} = \\mathbf{${fogOfX}}$
        </li>
      `;

      gofStepsHtml = `
        <li>Substitusikan $f(x)$: $(g \\circ f)(x) = g(${a}x ${formatSignNumber(b)}) = ${c}(${a}x ${formatSignNumber(b)})^2 ${formatSignNumber(d)}$.</li>
        <li>Kuadratkan suku binomial dan sederhanakan: $= ${gofFormulaStr}$.</li>
        <li>Evaluasi numerik pada masukan $x = ${x}$:<br>
          $f(${x}) = ${a}(${x}) ${formatSignNumber(b)} = ${fOfX}$<br>
          $g(${fOfX}) = ${c}(${fOfX})^2 ${formatSignNumber(d)} = \\mathbf{${gofOfX}}$
        </li>
      `;
    } else {
      // g(x) = cx + d (Linear & Linear)
      gOfX = (c * x) + d;
      fogOfX = (a * gOfX) + b;

      fOfX = (a * x) + b;
      gofOfX = (c * fOfX) + d;

      const ac = a * c;
      const ad_b = (a * d) + b;
      const termAC = ac === 1 ? 'x' : (ac === -1 ? '-x' : `${ac}x`);
      const termAD_B = ad_b !== 0 ? formatSignNumber(ad_b) : '';
      fogFormulaStr = `(f \\circ g)(x) = ${termAC} ${termAD_B}`;

      const ca = c * a;
      const cb_d = (c * b) + d;
      const termCA = ca === 1 ? 'x' : (ca === -1 ? '-x' : `${ca}x`);
      const termCB_D = cb_d !== 0 ? formatSignNumber(cb_d) : '';
      gofFormulaStr = `(g \\circ f)(x) = ${termCA} ${termCB_D}`;

      fogStepsHtml = `
        <li>Substitusikan $g(x)$: $(f \\circ g)(x) = f(${c}x ${formatSignNumber(d)}) = ${a}(${c}x ${formatSignNumber(d)}) ${formatSignNumber(b)}$.</li>
        <li>Distribusi aljabar: $= ${fogFormulaStr}$.</li>
        <li>Evaluasi numerik pada $x = ${x}$:<br>
          $g(${x}) = ${gOfX}$, lalu $f(${gOfX}) = \\mathbf{${fogOfX}}$.
        </li>
      `;

      gofStepsHtml = `
        <li>Substitusikan $f(x)$: $(g \\circ f)(x) = g(${a}x ${formatSignNumber(b)}) = ${c}(${a}x ${formatSignNumber(b)}) ${formatSignNumber(d)}$.</li>
        <li>Distribusi aljabar: $= ${gofFormulaStr}$.</li>
        <li>Evaluasi numerik pada $x = ${x}$:<br>
          $f(${x}) = ${fOfX}$, lalu $g(${fOfX}) = \\mathbf{${gofOfX}}$.
        </li>
      `;
    }

    const isIdentical = (fogOfX === gofOfX);

    labCompResults.innerHTML = `
      <div class="comparison-grid" style="margin-top: 0;">
        <div class="comp-box">
          <div class="comp-header">
            <span class="comp-tag">ALUR A</span>
            <h4 class="comp-title">Hasil $(f \\circ g)(x)$</h4>
          </div>
          <div class="comp-body">
            <p><strong>Rumus Aljabar:</strong> $$${fogFormulaStr}$$</p>
            <ol class="step-list">
              ${fogStepsHtml}
            </ol>
            <div class="result-box sage-box">
              <span class="box-title">Nilai Akhir:</span>
              <span class="box-eq">$$(f \\circ g)(${x}) = ${fogOfX}$$</span>
            </div>
          </div>
        </div>

        <div class="comp-box">
          <div class="comp-header">
            <span class="comp-tag">ALUR B</span>
            <h4 class="comp-title">Hasil $(g \\circ f)(x)$</h4>
          </div>
          <div class="comp-body">
            <p><strong>Rumus Aljabar:</strong> $$${gofFormulaStr}$$</p>
            <ol class="step-list">
              ${gofStepsHtml}
            </ol>
            <div class="result-box navy-box">
              <span class="box-title">Nilai Akhir:</span>
              <span class="box-eq">$$(g \\circ f)(${x}) = ${gofOfX}$$</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sandbox-verdict" style="margin-top: 16px;">
        ${!isIdentical 
          ? `<strong>Kesimpulan Ilmiah:</strong> Pada nilai uji $x = ${x}$, diperoleh $(f \\circ g)(${x}) = ${fogOfX}$ dan $(g \\circ f)(${x}) = ${gofOfX}$. Terbukti bahwa $(f \\circ g)(x) \\ne (g \\circ f)(x)$, menegaskan sifat non-komutatif fungsi komposisi.`
          : `<strong>Catatan Khusus:</strong> Pada titik spesifik $x = ${x}$, kedua alur bernilai sama (${fogOfX}), namun secara umum kedua fungsi memiliki bentuk rumus aljabar yang berbeda.`
        }
      </div>
    `;

    if (typeof renderMathInElement === 'function') {
      renderMathInElement(labCompResults, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  };

  if (btnCalculateCompLab) {
    btnCalculateCompLab.addEventListener('click', runCompLabCalculation);
  }


  // --- C. MODUL 2: PRAKTIK FUNGSI INVERS KUSTOM ---
  const invTypeSelect = document.getElementById('invTypeSelect');
  const invCoeffA = document.getElementById('invCoeffA');
  const invConstB = document.getElementById('invConstB');
  const invCoeffC = document.getElementById('invCoeffC');
  const invConstD = document.getElementById('invConstD');
  const wrapInvC = document.getElementById('wrapInvC');
  const wrapInvD = document.getElementById('wrapInvD');
  const previewFormulaInv = document.getElementById('previewFormulaInv');
  const labInvInputX = document.getElementById('labInvInputX');
  const btnCalculateInvLab = document.getElementById('btnCalculateInvLab');
  const labInvResults = document.getElementById('labInvResults');
  const invPresetBtns = document.querySelectorAll('[data-inv-preset]');

  const updateInvFormVisibility = () => {
    if (!invTypeSelect) return;
    const type = invTypeSelect.value;
    if (wrapInvC && wrapInvD) {
      if (type === 'fraction') {
        wrapInvC.style.display = 'flex';
        wrapInvD.style.display = 'flex';
      } else {
        wrapInvC.style.display = 'none';
        wrapInvD.style.display = 'none';
      }
    }
    updateInvPreview();
  };

  const updateInvPreview = () => {
    if (!invTypeSelect || !invCoeffA || !invConstB || !previewFormulaInv) return;
    const type = invTypeSelect.value;
    const a = parseFloat(invCoeffA.value) || 0;
    const b = parseFloat(invConstB.value) || 0;
    const c = invCoeffC ? (parseFloat(invCoeffC.value) || 0) : 0;
    const d = invConstD ? (parseFloat(invConstD.value) || 0) : 0;

    let str = '';
    if (type === 'linear') {
      str = `$$f(x) = ${a === 1 ? 'x' : (a === -1 ? '-x' : a + 'x')} ${formatSignNumber(b)}$$`;
    } else if (type === 'fraction') {
      str = `$$f(x) = \\frac{${a === 1 ? 'x' : a + 'x'} ${formatSignNumber(b)}}{${c === 1 ? 'x' : c + 'x'} ${formatSignNumber(d)}}$$`;
    } else if (type === 'quad') {
      str = `$$f(x) = ${a === 1 ? 'x^2' : a + 'x^2'} ${formatSignNumber(b)}, \\quad x \\ge 0$$`;
    }

    previewFormulaInv.innerHTML = str;
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(previewFormulaInv, { delimiters: [{ left: '$$', right: '$$', display: true }], throwOnError: false });
    }
  };

  if (invTypeSelect) invTypeSelect.addEventListener('change', updateInvFormVisibility);
  [invCoeffA, invConstB, invCoeffC, invConstD].forEach(el => {
    if (el) el.addEventListener('input', updateInvPreview);
  });

  invPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      invPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.getAttribute('data-inv-preset');

      if (p === 'invLinear1') {
        invTypeSelect.value = 'linear';
        invCoeffA.value = 3;
        invConstB.value = -6;
      } else if (p === 'invLinear2') {
        invTypeSelect.value = 'linear';
        invCoeffA.value = 5;
        invConstB.value = 10;
      } else if (p === 'invFrac') {
        invTypeSelect.value = 'fraction';
        invCoeffA.value = 2;
        invConstB.value = -1;
        invCoeffC.value = 1;
        invConstD.value = 3;
      } else if (p === 'invQuad') {
        invTypeSelect.value = 'quad';
        invCoeffA.value = 1;
        invConstB.value = 0;
      }
      updateInvFormVisibility();
      runInvLabCalculation();
    });
  });

  const runInvLabCalculation = () => {
    if (!labInvResults || !invTypeSelect || !invCoeffA || !invConstB || !labInvInputX) return;

    const type = invTypeSelect.value;
    const a = parseFloat(invCoeffA.value) || 0;
    const b = parseFloat(invConstB.value) || 0;
    const c = invCoeffC ? (parseFloat(invCoeffC.value) || 0) : 0;
    const d = invConstD ? (parseFloat(invConstD.value) || 0) : 0;
    const x = parseFloat(labInvInputX.value) || 0;

    if (type === 'linear' && a === 0) {
      alert('Pada fungsi linear, nilai koefisien a tidak boleh sama dengan 0.');
      return;
    }

    let stepsHtml = '';
    let formulaInversLatex = '';
    let yValue, restoredX;

    if (type === 'linear') {
      yValue = (a * x) + b;
      restoredX = (yValue - b) / a;

      formulaInversLatex = `f^{-1}(x) = \\frac{x ${formatSignNumber(-b)}}{${a}}`;

      stepsHtml = `
        <div class="timeline-step">
          <span class="step-badge-circle">1</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tuliskan dalam peubah $y$</h4>
            <p>$y = ${a}x ${formatSignNumber(b)}$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">2</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tukarkan posisi peubah $x$ dan $y$</h4>
            <p>$x = ${a}y ${formatSignNumber(b)}$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">3</span>
          <div class="timeline-content">
            <h4 class="step-heading">Isolasi variabel $y$</h4>
            <p>$x ${formatSignNumber(-b)} = ${a}y \\implies y = \\frac{x ${formatSignNumber(-b)}}{${a}}$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">4</span>
          <div class="timeline-content">
            <h4 class="step-heading">Gantikan dengan notasi $f^{-1}(x)$</h4>
            <p>$$${formulaInversLatex}$$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">5</span>
          <div class="timeline-content">
            <h4 class="step-heading">Verifikasi Komposisi Identitas</h4>
            <p>$f(f^{-1}(x)) = ${a}\\left(\\frac{x ${formatSignNumber(-b)}}{${a}}\\right) ${formatSignNumber(b)} = (x ${formatSignNumber(-b)}) ${formatSignNumber(b)} = x$ (Terbukti Sah).</p>
          </div>
        </div>
      `;
    } else if (type === 'fraction') {
      if ((c * x + d) === 0) {
        alert(`Nilai x = ${x} membuat penyebut bernilai nol. Masukkan nilai x yang berbeda.`);
        return;
      }
      yValue = ((a * x) + b) / ((c * x) + d);
      restoredX = ((-d * yValue) + b) / ((c * yValue) - a);

      const asymX = (a / c).toFixed(2);
      formulaInversLatex = `f^{-1}(x) = \\frac{${-d === 1 ? 'x' : (-d === -1 ? '-x' : -d + 'x')} ${formatSignNumber(b)}}{${c === 1 ? 'x' : c + 'x'} ${formatSignNumber(-a)}}, \\quad x \\ne ${asymX}`;

      stepsHtml = `
        <div class="timeline-step">
          <span class="step-badge-circle">1</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tuliskan dalam peubah $y$</h4>
            <p>$$y = \\frac{${a}x ${formatSignNumber(b)}}{${c}x ${formatSignNumber(d)}}$$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">2</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tukarkan posisi peubah $x$ dan $y$</h4>
            <p>$$x = \\frac{${a}y ${formatSignNumber(b)}}{${c}y ${formatSignNumber(d)}}$$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">3</span>
          <div class="timeline-content">
            <h4 class="step-heading">Kalikan silang dan kumpulkan suku $y$</h4>
            <p>$x(${c}y ${formatSignNumber(d)}) = ${a}y ${formatSignNumber(b)} \\implies ${c}xy ${formatSignNumber(d)}x = ${a}y ${formatSignNumber(b)}$<br>
            ${c}xy - ${a}y = ${-d}x ${formatSignNumber(b)} \\implies y(${c}x ${formatSignNumber(-a)}) = ${-d}x ${formatSignNumber(b)}$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">4</span>
          <div class="timeline-content">
            <h4 class="step-heading">Bagi kedua ruas untuk memperoleh rumus $f^{-1}(x)$</h4>
            <p>$$${formulaInversLatex}$$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">5</span>
          <div class="timeline-content">
            <h4 class="step-heading">Syarat Daerah Asal (Domain Invers)</h4>
            <p>Penyebut pecahan tidak boleh nol: $${c}x ${formatSignNumber(-a)} \\ne 0 \\implies x \\ne \\frac{${a}}{${c}}$.</p>
          </div>
        </div>
      `;
    } else if (type === 'quad') {
      yValue = (a * x * x) + b;
      restoredX = Math.sqrt((yValue - b) / a);

      formulaInversLatex = `f^{-1}(x) = \\sqrt{\\frac{x ${formatSignNumber(-b)}}{${a}}}, \\quad x \\ge ${b}`;

      stepsHtml = `
        <div class="timeline-step">
          <span class="step-badge-circle">1</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tuliskan dalam peubah $y$ dengan domain terbatas</h4>
            <p>$y = ${a}x^2 ${formatSignNumber(b)}, \\quad x \\ge 0$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">2</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tukarkan posisi peubah $x$ dan $y$</h4>
            <p>$x = ${a}y^2 ${formatSignNumber(b)}, \\quad y \\ge 0$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">3</span>
          <div class="timeline-content">
            <h4 class="step-heading">Isolasi variabel $y^2$</h4>
            <p>$x ${formatSignNumber(-b)} = ${a}y^2 \\implies y^2 = \\frac{x ${formatSignNumber(-b)}}{${a}}$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">4</span>
          <div class="timeline-content">
            <h4 class="step-heading">Tarik akar kuadrat positif</h4>
            <p>Karena disyaratkan $y \\ge 0$, diambil akar bernilai positif:
            $$${formulaInversLatex}$$</p>
          </div>
        </div>
        <div class="timeline-step">
          <span class="step-badge-circle">5</span>
          <div class="timeline-content">
            <h4 class="step-heading">Pemeriksaan Identitas</h4>
            <p>$f(f^{-1}(x)) = ${a}\\left(\\sqrt{\\frac{x ${formatSignNumber(-b)}}{${a}}}\\right)^2 ${formatSignNumber(b)} = (x ${formatSignNumber(-b)}) ${formatSignNumber(b)} = x$.</p>
          </div>
        </div>
      `;
    }

    const fmtX = Number.isInteger(x) ? x : x.toFixed(2);
    const fmtY = Number.isInteger(yValue) ? yValue : yValue.toFixed(2);
    const fmtRestored = Number.isInteger(restoredX) ? restoredX : restoredX.toFixed(2);

    labInvResults.innerHTML = `
      <div class="lab-step-breakdown-card">
        <h4 class="breakdown-title">Derivasi 5 Langkah Sistematis</h4>
        <div class="procedure-timeline" style="margin: 0 0 20px 0;">
          ${stepsHtml}
        </div>

        <h4 class="breakdown-title" style="margin-top: 24px;">Uji Siklus Pembalikan Identitas $(f^{-1} \\circ f)(x)$</h4>
        <div class="inverse-cycle-display" style="margin: 0 0 16px 0;">
          <div class="cycle-box">
            <span class="cy-lbl">1. Masukan Asal ($x$)</span>
            <span class="cy-val">${fmtX}</span>
          </div>
          <div class="cycle-arrow">&rarr; $f(${fmtX})$ &rarr;</div>
          <div class="cycle-box">
            <span class="cy-lbl">2. Luaran Fungsi ($y$)</span>
            <span class="cy-val">${fmtY}</span>
          </div>
          <div class="cycle-arrow">&rarr; $f^{-1}(${fmtY})$ &rarr;</div>
          <div class="cycle-box highlight-success">
            <span class="cy-lbl">3. Hasil Balikan ($x$)</span>
            <span class="cy-val">${fmtRestored}</span>
          </div>
        </div>
        <div class="sandbox-verdict">
          Terbukti: Nilai masukan $x = ${fmtX}$ dipetakan ke $y = ${fmtY}$, lalu diproses kembali oleh invers menghasilkan $x = ${fmtRestored}$. Hubungan timbal balik identitas terpenuhi secara mutlak.
        </div>
      </div>
    `;

    if (typeof renderMathInElement === 'function') {
      renderMathInElement(labInvResults, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  };

  if (btnCalculateInvLab) {
    btnCalculateInvLab.addEventListener('click', runInvLabCalculation);
  }


  // --- D. MODUL 3: TANTANGAN LATIHAN BERHITUNG MANDIRI ---
  let currentChallenge = null;
  let solvedChallengesCount = 0;

  const challengePromptText = document.getElementById('challengePromptText');
  const lblChallengeStep1 = document.getElementById('lblChallengeStep1');
  const lblChallengeStep2 = document.getElementById('lblChallengeStep2');
  const inputChallengeStep1 = document.getElementById('inputChallengeStep1');
  const inputChallengeStep2 = document.getElementById('inputChallengeStep2');
  const btnVerifyChallenge = document.getElementById('btnVerifyChallenge');
  const btnShowChallengeHint = document.getElementById('btnShowChallengeHint');
  const btnNewChallenge = document.getElementById('btnNewChallenge');
  const challengeFeedbackBox = document.getElementById('challengeFeedbackBox');
  const challengeSolvedCount = document.getElementById('challengeSolvedCount');
  const challengeTopicBadge = document.getElementById('challengeTopicBadge');

  const challengeBank = [
    {
      topic: 'KOMPOSISI LINEAR',
      prompt: 'Diketahui fungsi $f(x) = 3x - 2$ dan $g(x) = 2x + 4$. Tentukan nilai dari $(f \\circ g)(3)$!',
      step1Label: 'Langkah 1: Hitung nilai fungsi dalam $g(3)$:',
      step2Label: 'Langkah 2: Hitung nilai akhir $(f \\circ g)(3) = f(g(3))$:',
      step1Ans: 10,  // g(3) = 2(3)+4 = 10
      step2Ans: 28,  // f(10) = 3(10)-2 = 28
      hint: 'Hitung $g(3) = 2(3) + 4 = 10$. Setelah itu, substitusikan hasil 10 ke rumus $f(x) = 3(10) - 2$.',
      solution: '$(f \\circ g)(3) = f(g(3))$. Pertama: $g(3) = 2(3) + 4 = 10$. Kedua: $f(10) = 3(10) - 2 = 28$. Jadi hasil akhirnya adalah 28.'
    },
    {
      topic: 'KOMPOSISI KUADRAT',
      prompt: 'Diberikan fungsi $f(x) = 2x + 5$ dan $g(x) = x^2 - 3$. Tentukan nilai dari $(g \\circ f)(1)$!',
      step1Label: 'Langkah 1: Hitung nilai fungsi dalam $f(1)$:',
      step2Label: 'Langkah 2: Hitung nilai akhir $(g \\circ f)(1) = g(f(1))$:',
      step1Ans: 7,   // f(1) = 2(1)+5 = 7
      step2Ans: 46,  // g(7) = 7^2 - 3 = 46
      hint: 'Perhatikan urutan komposisinya: $(g \\circ f)(1) = g(f(1))$. Hitung $f(1)$ dahulu, baru kuadratkan hasilnya dan kurangi 3.',
      solution: '$(g \\circ f)(1) = g(f(1))$. Pertama: $f(1) = 2(1) + 5 = 7$. Kedua: $g(7) = (7)^2 - 3 = 49 - 3 = 46$. Jadi hasil akhirnya adalah 46.'
    },
    {
      topic: 'EVALUASI INVERS LINEAR',
      prompt: 'Diberikan $f(x) = 4x - 12$. Tentukan nilai prapeta dari $f^{-1}(8)$!',
      step1Label: 'Langkah 1: Cari rumus invers $f^{-1}(x)$, lalu masukkan konstanta pembagi:',
      step2Label: 'Langkah 2: Hitung nilai akhir $f^{-1}(8)$:',
      step1Ans: 4,   // koefisien pembagi 4
      step2Ans: 5,   // (8 + 12)/4 = 5
      hint: 'Persamaan $y = 4x - 12 \\implies x = \\frac{y + 12}{4}$. Jika $y = 8$, hitung $\\frac{8 + 12}{4}$.',
      solution: 'Rumus invers: $f^{-1}(x) = \\frac{x + 12}{4}$. Masukkan $x = 8$: $f^{-1}(8) = \\frac{8 + 12}{4} = \\frac{20}{4} = 5$.'
    },
    {
      topic: 'KOMPOSISI PECAHAN',
      prompt: 'Diketahui $f(x) = \\frac{x + 6}{2}$ dan $g(x) = 3x - 1$. Tentukan nilai dari $(f \\circ g)(3)$!',
      step1Label: 'Langkah 1: Hitung nilai fungsi dalam $g(3)$:',
      step2Label: 'Langkah 2: Hitung nilai akhir $(f \\circ g)(3)$:',
      step1Ans: 8,   // g(3) = 3(3)-1 = 8
      step2Ans: 7,   // f(8) = (8+6)/2 = 7
      hint: 'Cari $g(3) = 3(3) - 1 = 8$. Lalu masukkan 8 ke dalam $f(8) = \\frac{8 + 6}{2}$.',
      solution: '$g(3) = 9 - 1 = 8$. Maka $(f \\circ g)(3) = f(8) = \\frac{8 + 6}{2} = \\frac{14}{2} = 7$.'
    },
    {
      topic: 'INVERS FUNGSI KUADRAT',
      prompt: 'Diberikan $f(x) = x^2 + 5$ dengan domain $x \\ge 0$. Tentukan nilai dari $f^{-1}(30)$!',
      step1Label: 'Langkah 1: Kurangkan nilai dengan konstanta (30 - 5):',
      step2Label: 'Langkah 2: Hitung nilai akhir $f^{-1}(30) = \\sqrt{25}$:',
      step1Ans: 25,  // 30 - 5 = 25
      step2Ans: 5,   // sqrt(25) = 5
      hint: 'Invers fungsi kuadrat adalah $f^{-1}(x) = \\sqrt{x - 5}$. Masukkan $x = 30$, maka nilai di dalam akar adalah $30 - 5 = 25$.',
      solution: '$f^{-1}(x) = \\sqrt{x - 5}$. Untuk $x = 30$, kita peroleh $f^{-1}(30) = \\sqrt{30 - 5} = \\sqrt{25} = 5$.'
    }
  ];

  let challengeIndex = 0;

  const loadChallenge = (idx) => {
    currentChallenge = challengeBank[idx % challengeBank.length];
    if (challengeTopicBadge) challengeTopicBadge.textContent = currentChallenge.topic;
    if (challengePromptText) challengePromptText.innerHTML = currentChallenge.prompt;
    if (lblChallengeStep1) lblChallengeStep1.textContent = currentChallenge.step1Label;
    if (lblChallengeStep2) lblChallengeStep2.textContent = currentChallenge.step2Label;

    if (inputChallengeStep1) inputChallengeStep1.value = '';
    if (inputChallengeStep2) inputChallengeStep2.value = '';
    if (challengeFeedbackBox) {
      challengeFeedbackBox.style.display = 'none';
      challengeFeedbackBox.className = 'challenge-feedback-box';
      challengeFeedbackBox.innerHTML = '';
    }

    if (typeof renderMathInElement === 'function') {
      renderMathInElement(challengePromptText, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      renderMathInElement(lblChallengeStep1, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      renderMathInElement(lblChallengeStep2, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
    }
  };

  if (btnNewChallenge) {
    btnNewChallenge.addEventListener('click', () => {
      challengeIndex = (challengeIndex + 1) % challengeBank.length;
      loadChallenge(challengeIndex);
      showToast('Soal latihan baru siap dikerjakan!');
    });
  }

  if (btnShowChallengeHint) {
    btnShowChallengeHint.addEventListener('click', () => {
      if (!currentChallenge || !challengeFeedbackBox) return;
      challengeFeedbackBox.style.display = 'block';
      challengeFeedbackBox.className = 'challenge-feedback-box hint';
      challengeFeedbackBox.innerHTML = `<strong>Petunjuk:</strong> ${currentChallenge.hint}`;
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(challengeFeedbackBox, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      }
    });
  }

  if (btnVerifyChallenge) {
    btnVerifyChallenge.addEventListener('click', () => {
      if (!currentChallenge || !inputChallengeStep1 || !inputChallengeStep2 || !challengeFeedbackBox) return;

      const userStep1 = parseFloat(inputChallengeStep1.value);
      const userStep2 = parseFloat(inputChallengeStep2.value);

      if (isNaN(userStep1) || isNaN(userStep2)) {
        alert('Mohon isi kedua langkah perhitungan (Langkah 1 dan Langkah 2) sebelum memeriksa.');
        return;
      }

      challengeFeedbackBox.style.display = 'block';

      const isStep1Correct = Math.abs(userStep1 - currentChallenge.step1Ans) < 0.001;
      const isStep2Correct = Math.abs(userStep2 - currentChallenge.step2Ans) < 0.001;

      if (isStep1Correct && isStep2Correct) {
        challengeFeedbackBox.className = 'challenge-feedback-box success';
        challengeFeedbackBox.innerHTML = `
          <strong>Luar Biasa! Perhitungan Anda 100% Benar.</strong><br>
          Langkah 1 (${userStep1}) tepat, dan hasil akhir (${userStep2}) sangat akurat.<br>
          <em>${currentChallenge.solution}</em>
        `;
        solvedChallengesCount++;
        if (challengeSolvedCount) challengeSolvedCount.textContent = solvedChallengesCount;
        showToast('Tantangan berhasil diselesaikan dengan tepat!');
      } else if (!isStep1Correct) {
        challengeFeedbackBox.className = 'challenge-feedback-box hint';
        challengeFeedbackBox.innerHTML = `
          <strong>Periksa Kembali Langkah 1:</strong> Nilai langkah antara Anda (${userStep1}) belum sesuai. Pastikan Anda menyubstitusikan nilai ke dalam fungsi bagian dalam dengan teliti.<br>
          <em>Petunjuk: ${currentChallenge.hint}</em>
        `;
      } else {
        challengeFeedbackBox.className = 'challenge-feedback-box hint';
        challengeFeedbackBox.innerHTML = `
          <strong>Langkah 1 Sudah Benar!</strong> Nilai antara Anda (${userStep1}) tepat. Namun hasil akhir pada Langkah 2 (${userStep2}) masih keliru. Masukkan kembali nilai antara tersebut ke fungsi terluar.<br>
          <em>Petunjuk: ${currentChallenge.hint}</em>
        `;
      }

      if (typeof renderMathInElement === 'function') {
        renderMathInElement(challengeFeedbackBox, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
      }
    });
  }

  // Inisialisasi tampilan awal modul laboratorium
  updateCompPreviews();
  runCompLabCalculation();
  updateInvFormVisibility();
  runInvLabCalculation();
  loadChallenge(0);

});

