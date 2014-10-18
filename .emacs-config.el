(if (featurep 'project-root)
    (progn
      (defun webster-repl ()
        (interactive)
        (webster-server)
        (with-project-root
            (run-lisp (concat default-directory "WebsterEditor/scripts/repl"))))
      (defun webster-server ()
        (interactive)
        (with-project-root
            (start-process "webster server" "*Webster-server*" (concat default-directory "WebsterEditor/scripts/server"))))))



