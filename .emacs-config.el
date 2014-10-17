(if (featurep 'project-root)
    (progn
      (defun webster-repl ()
        (interactive)
        (with-project-root
            (run-lisp (concat default-directory "WebsterEditor/scripts/repl"))))))

