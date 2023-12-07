/***************************************************************************************************
Extension Name: \\ex-csat
File: component-csat
Owner: ahmedalaaezzt
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {
  var lang = $("html").attr("lang").toLowerCase();

 let dictionry = {
   "en": {
     "emotions": {
       "title": "How was your experience?"
     },
     "success": {
       "title": "Thank you!",
       "description": "We really appreciate your feedback and we'll use it to improve your experience"
     },
     "error": {
       "title": "Sorry, something went wrong!",
       "description": "We could not record your responses at this time. Please try again later."
     },
     "rate": {
       "title": "Rate your experience",
       "buttons": {
         "submit": "Submit",
         "back": "Back",
         "cancel": "Cancel"
       },
       "rates": {
         "ease": "Ease of use",
         "quality": "Quality of information",
         "performance": "Overall website performance"
       },
       "comment": {
         "label": "Add comment (optional)",
         "placeholder": "We'd love to hear from you"
       }
     },
     "feedback": "Feedback",
     "chatbot": "Virtual Assistant"
   },
   "ar-ae": {
     "emotions": {
       "title": "كيف كانت تجربتك"
     },
     "success": {
       "title": "شكرا جزيلا!",
       "description": "نحن نقدر حقًا تعليقاتك وسنستخدمها لتحسين تجربتك"
     },
     "error": {
       "title": "عذرا، هناك خطأ ما!",
       "description": "لم نتمكن من تسجيل ردودك في هذا الوقت. الرجاء معاودة المحاولة في وقت لاحق."
     },
     "rate": {
       "title": "قيم تجربتك",
       "buttons": {
         "submit": "إرسال",
         "back": "عودة",
         "cancel": "إلغاء"
       },
       "rates": {
         "ease": "سهولة الاستعمال",
         "quality": "جودة المعلومات",
         "performance": "الأداء العام للموقع"
       },
       "comment": {
         "label": "أضف تعليق (اختياري)",
         "placeholder": "نحب أن نسمع منك"
       }
     },
     "feedback": "ردود الفعل",
     "chatbot": "مساعد افتراضي"
   },
   "he-il": {
     "emotions": {
       "title": "איך הייתה החוויה שלך?"
     },
     "success": {
       "title": "תודה!",
       "description": "אנו מאוד מעריכים את המשוב שלך ונשתמש בו כדי לשפר את החוויה שלך"
     },
     "error": {
       "title": "מצטערים, משהו השתבש!",
       "description": "לא הצלחנו להקליט את תשובותיך בשלב זה. בבקשה נסה שוב מאוחר יותר."
     },
     "rate": {
       "title": "דרג את החוויה שלך",
       "buttons": {
         "submit": "שלח",
         "back": "חזור",
         "cancel": "לְבַטֵל"
       },
       "rates": {
         "ease": "קלות שימוש",
         "quality": "איכות המידע",
         "performance": "ביצועי אתרים כלליים"
       },
       "comment": {
         "label": "הוסף תגובה (אופציונלי)",
         "placeholder": "נשמח לשמוע ממך"
       }
     },
     "feedback": "מָשׁוֹב",
     "chatbot": "עוזר וירטואלי"
   },
   "de-de": {
     "emotions": {
       "title": "Hoe was je ervaring?"
     },
     "success": {
       "title": "Dank je!",
       "description": "We stellen uw feedback zeer op prijs en zullen deze gebruiken om uw ervaring te verbeteren"
     },
     "error": {
       "title": "Sorry, er ging iets mis!",
       "description": "We kunnen uw reacties op dit moment niet opnemen. Probeer het later opnieuw."
     },
     "rate": {
       "title": "Beoordeel uw ervaring",
       "buttons": {
         "submit": "Verzenden",
         "back": "Terug",
         "cancel": "annuleren"
       },
       "rates": {
         "ease": "Makkelijk te gebruiken",
         "quality": "Kwaliteit van informatie",
         "performance": "Algemene websiteprestaties"
       },
       "comment": {
         "label": "Reactie toevoegen (optioneel)",
         "placeholder": "We zouden graag van je horen"
       }
     },
     "feedback": "Feedback",
     "chatbot": "Virtuele assistent"
   },
   "es-es": {
     "emotions": {
       "title": "¿Cómo fue tu experiencia?"
     },
     "success": {
       "title": "¡Gracias!",
       "description": "Realmente apreciamos sus comentarios y los usaremos para mejorar su experiencia"
     },
     "error": {
       "title": "¡Perdón, algo salió mal!",
       "description": "No pudimos registrar sus respuestas en este momento. Por favor, inténtelo de nuevo más tarde."
     },
     "rate": {
       "title": "Califica tu experiencia",
       "buttons": {
         "submit": "Enviar",
         "back": "atrás",
         "cancel": "Cancelar"
       },
       "rates": {
         "ease": "Facilidad de uso",
         "quality": "Calidad de la información",
         "performance": "Rendimiento general del sitio web"
       },
       "comment": {
         "label": "Agregar comentario (opcional)",
         "placeholder": "Nos encantaría saber de ti"
       }
     },
     "feedback": "Realimentación",
     "chatbot": "Asistente virtual"
   },
   "fr-fr": {
     "emotions": {
       "title": "Comment était ton expérience?"
     },
     "success": {
       "title": "Merci!",
       "description": "Nous apprécions vraiment vos commentaires et nous les utiliserons pour améliorer votre expérience"
     },
     "error": {
       "title": "Désolé, quelque chose s'est mal passé!",
       "description": "Nous n'avons pas pu enregistrer vos réponses pour le moment. Veuillez réessayer plus tard."
     },
     "rate": {
       "title": "Évaluez votre expérience",
       "buttons": {
         "submit": "Soumettre",
         "back": "Arrière",
         "cancel": "Annuler"
       },
       "rates": {
         "ease": "Facilité d'utilisation",
         "quality": "Qualité de l'information",
         "performance": "Performance globale du site Web"
       },
       "comment": {
         "label": "Ajouter un commentaire (facultatif)",
         "placeholder": "Nous aimerions recevoir de vos nouvelles"
       }
     },
     "feedback": "Retour d'information",
     "chatbot": "Assistant virtuel"
   },
   "hi-in": {
     "emotions": {
       "title": "आपका अनुभव कैसा रहा?"
     },
     "success": {
       "title": "धन्यवाद!",
       "description": "हम वास्तव में आपकी प्रतिक्रिया की सराहना करते हैं और हम इसका उपयोग आपके अनुभव को बेहतर बनाने के लिए करेंगे"
     },
     "error": {
       "title": "क्षमा करें, कुछ गलत हो गया!",
       "description": "हम इस समय आपकी प्रतिक्रियाओं को रिकॉर्ड नहीं कर सके। बाद में पुन: प्रयास करें।"
     },
     "rate": {
       "title": "अपने अनुभव को रेट करें",
       "buttons": {
         "submit": "प्रस्तुत",
         "back": "वापस",
         "cancel": "रद्द करना"
       },
       "rates": {
         "ease": "उपयोग में आसानी",
         "quality": "जानकारी की गुणवत्ता",
         "performance": "कुल मिलाकर वेबसाइट प्रदर्शन"
       },
       "comment": {
         "label": "टिप्पणी जोड़ें (वैकल्पिक)",
         "placeholder": "हमे आपसे सुनने में ख़ुशी होगी"
       }
     },
     "feedback": "प्रतिपुष्टि",
     "chatbot": "आभासी सहायक"
   },
   "zh-cn": {
     "emotions": {
       "title": "您的经历如何？"
     },
     "success": {
       "title": "谢谢！",
       "description": "非常感谢您的反馈，我们将用它来改善您的体验"
     },
     "error": {
       "title": "抱歉，出了一些问题！",
       "description": "我们目前无法记录您的回复。请稍后再试。"
     },
     "rate": {
       "title": "评价您的经验",
       "buttons": {
         "submit": "提交",
         "back": "背部",
         "cancel": "取消"
       },
       "rates": {
         "ease": "便于使用",
         "quality": "信息质量",
         "performance": "网站整体表现"
       },
       "comment": {
         "label": "添加评论（可选）",
         "placeholder": "我们很乐意听取您的意见"
       }
     },
     "feedback": "反馈",
     "chatbot": "虚拟助手"
   }

 };
 if(typeof GlobalCsatFeedbackJS != 'undefined'){
   var feedback = new GlobalCsatFeedbackJS({
     onSubmit: function (a, b) {
       console.log(a, b);
       try {
         $.post("/searchresults/pub/adfeedback/feedbacks", {
           surveyType: "general",
           smileyType: a,
           comments: b.comment,
           ratings: {
             ease: b.ease,
             quality: b.quality,
             performance: b.performance,
           },
           pageUrl: window.location.href,
         }).done(function (data) {
           console.log(data);
         });
       } catch (e) {
         console.log(e);
       }
     },
     locale: lang == "ar-ae" ? "ar" : "en",
   });
   
   feedback.init();
   
   
 }


});
